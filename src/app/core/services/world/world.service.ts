import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, take } from 'rxjs';
import { BiomesData, Burg, MapData, World } from '../../models/world/world';
import { WorldRaw } from '../../models/world/world-raw';
import {
  Edge,
  Node,
  Path,
  TransportationGrid,
} from '../../models/world/transportation-grid';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class WorldService {
  world!: World;

  svgMap!: Document;
  svgMapDisplay!: any;

  ground_grid!: TransportationGrid;
  sea_grid!: TransportationGrid;

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
          console.log('World loaded, ready to use');
          console.log(this.world);
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
    let world: World = {} as World;

    world.info = raw.info;
    world.mapCoordinates = raw.mapCoordinates;
    world.biomesData = this.convertBiomeData(raw.biomesData);
    world.mapData = this.convertMapData(raw.pack);
    world = this.convertWithProperId(world);
    return world;
  }

  private convertBiomeData(raw: any): BiomesData[] {
    let biomesData: BiomesData[] = [];
    for (let i = 0; i < raw.i.length; i++) {
      let id = raw.i[i];
      let b = {
        id: id,
        name: raw.name[i],
        color: raw.color[i],
        biomesMartix: raw.biomesMartix[i],
        habitability: raw.habitability[i],
        iconsDensity: raw.iconsDensity[i],
        icons: raw.icons[i],
        cost: raw.cost[i],
      } as BiomesData;
      biomesData.push(b);
    }
    return biomesData;
  }

  private convertWithProperId(raw: any): any {
    let result: any = JSON.parse(JSON.stringify(raw));
    for (let key in raw) {
      //rename key i to id for better readability
      if (key == 'i') {
        result['id'] = raw.i;
        delete result.i;
      }

      //if object, convert it if list convert all objects in list
      if (Object.prototype.toString.call(raw[key]) == '[object Object]') {
        result[key] = this.convertWithProperId(raw[key]);
      }

      if (Object.prototype.toString.call(raw[key]) == '[object Array]') {
        // console.log("this is an list, let's convert it");
        result[key] = [];
        for (let i = 0; i < raw[key].length; i++) {
          result[key].push(this.convertWithProperId(raw[key][i]));
        }
      }
    }
    return result;
  }

  private convertMapData(raw: any): MapData {
    //remove vertices
    delete raw.vertices;
    return raw as MapData;
  }

  getPathLength(id: string): number {
    // find path named trail+num and return its length
    let path = this.svgMap.getElementById(id) as unknown as SVGPathElement;
    if (path) {
      return path.getTotalLength();
    }
    return 0;
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

  findIntersectionsWithPath(
    path1: SVGPathElement,
    path2: SVGPathElement
  ): { point: SVGPoint | null; length1: number; length2: number } {
    let intersection: {
      point: SVGPoint | null;
      length1: number;
      length2: number;
    } = {
      point: null,
      length1: 0,
      length2: 0,
    };
    let precision = 1;
    let length1 = path1.getTotalLength();
    let length2 = path2.getTotalLength();
    for (let len = 0; len < length1; len += precision) {
      let point = path1.getPointAtLength(len);
      if (path2.isPointInFill(point)) {
        intersection = { point: point, length1: len, length2: -1 };
      }
    }

    for (let len = 0; len < length2; len += precision) {
      let point = path2.getPointAtLength(len);
      if (path1.isPointInFill(point)) {
        intersection.length2 = len;
      }
    }

    return intersection;
  }

  getEdgesFromPathAndPoints(path: SVGPathElement, points: Node[]): Edge[] {
    let edges: Edge[] = [];
    let pointsRelativesPositions = [];
    let errorMargin = 1.5;
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
    //add all path extremities as nodes
    for (let p of paths) {
      let start_path = p.getPointAtLength(0);
      let end_path = p.getPointAtLength(p.getTotalLength());
      grid.addNode(start_path.x, start_path.y);
      grid.addNode(end_path.x, end_path.y);
    }

    //show nodes on paths
    const points = grid.getNodes();
    for (const p of paths) {
      let isPointInPath;
      let pointsInPath: Node[] = [];
      for (const point of points) {
        //force bigger stroke width for better precision
        p.style.strokeWidth = '5';
        //no dash
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
          console.log('in stroke', p.id, ' there is', point.relatedBurg?.name);
          pointsInPath.push(point);
        }
      }
      let new_paths = this.getEdgesFromPathAndPoints(p, pointsInPath);
      grid.addEdges(new_paths);
    }
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

  getPathBetweenBurgs(burg1: string, burg2: string): Path {
    let burg1_ = this.getBurgByName(burg1);
    let burg2_ = this.getBurgByName(burg2);
    let path: Path;
    if (burg1_ && burg2_) {
      let b1 = this.ground_grid.getNodeClosestTo(burg1_.x, burg1_.y);
      let b2 = this.ground_grid.getNodeClosestTo(burg2_.x, burg2_.y);
      console.log('b1', b1, 'b2', b2);
      path = this.ground_grid.shortestPath(b1.id, b2.id);
    }
    return path!;
  }
}
