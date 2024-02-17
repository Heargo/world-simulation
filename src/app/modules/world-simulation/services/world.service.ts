import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, take } from 'rxjs';
import { BiomesData, MapData, World } from '../models/world';
import { DiplomacyEnum, WorldRaw } from '../models/world-raw';
import {
  Edge,
  Node,
  Path,
  TransportationGrid,
} from '../models/transportation-grid';
import { DomSanitizer } from '@angular/platform-browser';
import { Burg } from '../models/burg';

@Injectable({
  providedIn: 'root',
})
export class WorldService {
  world!: World;

  svgMap!: Document;
  svgMapDisplay!: any;

  ground_grid!: TransportationGrid;
  sea_grid!: TransportationGrid;

  loadComplete = false;

  constructor(
    private readonly http: HttpClient,
    private readonly domSanitize: DomSanitizer
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

  getEdgesFromPathAndPoints(path: SVGPathElement, points: Node[]): Edge[] {
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
      let pointsInPath: Node[] = [];
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

  getBurgByName(name: string): Burg | null {
    for (let burg of this.world.mapData.burgs) {
      if (burg.name == name) {
        return burg;
      }
    }
    return null;
  }

  getPathBetweenNodes(nodeID1: number, nodeID2: number): Path {
    return this.ground_grid.shortestPath(nodeID1, nodeID2);
  }

  getPathBetweenBurgs(burg1: string, burg2: string): Path {
    let burg1_ = this.getBurgByName(burg1);
    let burg2_ = this.getBurgByName(burg2);
    let path: Path;
    if (burg1_ && burg2_) {
      let b1 = this.ground_grid.getNodeClosestTo(burg1_.x, burg1_.y);
      let b2 = this.ground_grid.getNodeClosestTo(burg2_.x, burg2_.y);
      path = this.ground_grid.shortestPath(b1.id, b2.id);
    }
    return path!;
  }

  getBurgsByAttractivity(burgId: number): {
    burgs: Burg[];
    attractivity: number[];
  } {
    let burg = this.world.mapData.burgs.find(b => b.id === burgId)!;
    let state = burg.state;
    let otherBurgs = [...this.world.mapData.burgs.filter(b => b.id !== burgId)];
    let relativeAttractivity: number[] = [];
    //order by attractivity
    otherBurgs.sort((a, b) => {
      let diplomacyA = this.world.mapData.states[state!].diplomacy[a.state!];
      let diplomacyB = this.world.mapData.states[state!].diplomacy[b.state!];

      let distanceA = this.ground_grid.getDistanceBetweenTwoBurgs(
        burgId,
        a.id!
      );
      let distanceB = this.ground_grid.getDistanceBetweenTwoBurgs(
        burgId,
        b.id!
      );
      return (
        burg!.getRelativeAttractivity(
          diplomacyB as DiplomacyEnum,
          distanceB,
          state === b.state
        ) -
        burg!.getRelativeAttractivity(
          diplomacyA as DiplomacyEnum,
          distanceA,
          state === a.state
        )
      );
    });

    for (let otherBurg of otherBurgs) {
      let diplomacy =
        this.world.mapData.states[state!].diplomacy[otherBurg.state!];
      let distance = this.ground_grid.getDistanceBetweenTwoBurgs(
        burgId,
        otherBurg.id!
      );
      relativeAttractivity.push(
        burg.getRelativeAttractivity(
          diplomacy as DiplomacyEnum,
          distance,
          state === otherBurg.state
        )
      );
    }

    return { burgs: otherBurgs, attractivity: relativeAttractivity };
  }
}
