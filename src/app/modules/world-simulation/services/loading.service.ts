import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, take, catchError, of, map } from 'rxjs';
import { World } from '../models/world';
import { WorldRaw } from '../models/world-raw';
import { Burg } from '../models/burg';
import {
  Edge,
  GridNode,
  Path,
  TransportationGrid,
} from '../models/transportation-grid';
import { WorldService } from './world.service';
import { TransportService } from './transports.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  world!: World;

  svgMap!: Document;
  svgMapDisplay!: any;

  ground_grid!: TransportationGrid;
  sea_grid!: TransportationGrid;

  loadComplete = false;

  currentBurg!: Burg;

  constructor(
    private readonly http: HttpClient,
    private readonly domSanitize: DomSanitizer,
    private readonly worldService: WorldService,
    private readonly transportService: TransportService
  ) {}

  private loadWorldRaw(url: string): Observable<WorldRaw | null> {
    // save world and return true if successful
    return this.http.get<WorldRaw>(url).pipe(
      take(1),
      catchError(error => {
        console.error('Error loading world:', error);
        return of(null);
      })
    );
  }

  loadWorld(url: string): Observable<boolean> {
    //load raw
    let raw$: Observable<WorldRaw | null> = this.loadWorldRaw(url);
    return raw$.pipe(
      map(raw => {
        if (raw) {
          this.world = this.convertRawToModel(raw);
          console.log('World loaded, ready to use', this.world);
          return true;
        }
        return false;
      })
    );
  }

  loadSvgMap(url: string): Observable<boolean> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      take(1),
      map(svg => {
        this.svgMap = new DOMParser().parseFromString(svg, 'image/svg+xml');
        this.svgMapDisplay = this.domSanitize.bypassSecurityTrustHtml(
          this.svgMap.documentElement.outerHTML
        );
        console.log('SVG map loaded, ready to use');
        return true;
      }),
      catchError(error => {
        console.error('Error loading svg:', error);
        return of(false);
      })
    );
  }

  private convertRawToModel(raw: WorldRaw): World {
    return new World(raw);
  }

  findAllPaths(type: string, svg: SVGElement): SVGPathElement[] {
    let paths: SVGPathElement[] = [];
    let allPaths = svg.getElementsByTagName('path');
    for (let i = 0; i < allPaths.length; i++) {
      let path = allPaths[i] as unknown as SVGPathElement;
      if (path.id.includes(type)) {
        paths.push(path);
      }
    }
    return paths;
  }

  getEdgesFromPathAndPoints(path: SVGPathElement, points: GridNode[]): Edge[] {
    let edges: Edge[] = [];
    let pointsRelativesPositions = [];
    let errorMargin = 1;
    let unplotedPoints = [...points];
    //add start and end to unplotedpoints
    for (let len = 0; len < path.getTotalLength(); len += 1) {
      let p = path.getPointAtLength(len);
      for (let point of unplotedPoints) {
        if (
          p.x > point.x - errorMargin &&
          p.x < point.x + errorMargin &&
          p.y > point.y - errorMargin &&
          p.y < point.y + errorMargin
        ) {
          pointsRelativesPositions.push({ point: point, length: len });
          unplotedPoints = unplotedPoints.filter(p => p != point);
        }
      }
    }

    //create edges
    for (let i = 0; i < pointsRelativesPositions.length - 1; i++) {
      let p1 = pointsRelativesPositions[i];
      let p2 = pointsRelativesPositions[i + 1];
      let length = Math.abs(p1.length - p2.length);
      edges.push({
        id: TransportationGrid.EDGE_ID++,
        length: length,
        nodes: [p1.point.id, p2.point.id],
      });
    }

    return edges;
  }

  loadTransportationGrids(svg: SVGSVGElement) {
    this.ground_grid = this.loadTransportationGrid(svg, ['road', 'trail']);
    this.sea_grid = this.loadTransportationGrid(svg, ['searoute']);
  }

  private loadTransportationGrid(
    svg: SVGSVGElement,
    pathType: string[]
  ): TransportationGrid {
    let grid = new TransportationGrid();

    let paths: SVGPathElement[] = [];

    //add all burgs as nodes
    for (let burg of this.world.mapData.burgs) {
      if (burg.x && burg.y) grid.addNode(burg.x, burg.y, burg);
    }
    //find all paths
    for (let type of pathType) {
      paths = paths.concat(this.findAllPaths(type, svg));
    }
    //add all path extremities as nodes (with a 0.1 padding so it's considered on the path)
    for (let p of paths) {
      let start_path = p.getPointAtLength(0.1);
      let end_path = p.getPointAtLength(p.getTotalLength() - 0.1);
      let s = grid.addNode(start_path.x, start_path.y);
      let e = grid.addNode(end_path.x, end_path.y);
    }

    //show nodes on paths
    const points = grid.getNodes();
    for (const p of paths) {
      let isPointInPath;
      let pointsInPath: GridNode[] = [];
      for (const point of points) {
        //force bigger stroke width for better precision and remove dasharray
        p.setAttribute('stroke-width', '10');
        p.style.strokeDasharray = 'none';
        try {
          const pointObj = new DOMPoint(point.x, point.y);
          isPointInPath = p.isPointInStroke(pointObj);
        } catch (e) {
          console.log('error', e);
          // Fallback for browsers that don't support DOMPoint as an argument
          const pointObj = svg.createSVGPoint();
          pointObj.x = point.x;
          pointObj.y = point.y;
          isPointInPath = p.isPointInStroke(pointObj);
        }
        if (isPointInPath) {
          pointsInPath.push(point);
        }
      }
      let new_paths = this.getEdgesFromPathAndPoints(p, pointsInPath);
      grid.addEdges(new_paths);
    }
    grid.mergeNodes(1.5); //merge nodes that are closer than 1.5 units to each other
    grid.calculatePaths(); //calculate shortest paths
    return grid;
  }

  loadCompleted(): void {
    this.worldService.load(this.world, this.ground_grid, this.sea_grid);
    this.transportService.initCarriages(5); //need to be called after worldService.load
    this.worldService.currentBurg = this.world.mapData.burgs[294];
    this.loadComplete = true;
  }
}
