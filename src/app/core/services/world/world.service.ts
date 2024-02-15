import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, take } from 'rxjs';
import { BiomesData, Burg, MapData, World } from '../../models/world/world';
import { WorldRaw } from '../../models/world/world-raw';
import {
  Node,
  Path,
  TransportationGrid,
} from '../../models/world/transportation-grid';
import intersect from 'path-intersection';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class WorldService {
  world!: World;

  svgMap!: Document;
  svgMapDisplay!: any;
  debugSvgMap!: Document;
  debugSvgMapDisplay!: any;
  ground_grid!: TransportationGrid;

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
        this.debugSvgMap = new DOMParser().parseFromString(
          svg,
          'image/svg+xml'
        );
        this.debugSvgMap.documentElement.innerHTML = '';
        this.updateDebugDisplay();
        return true;
      }),
      catchError(error => {
        console.error('Error loading svg:', error);
        return of(false);
      })
    );
  }
  private updateSvgMap(svg: any) {
    this.debugSvgMap.documentElement.appendChild(svg);
    this.updateDebugDisplay();
  }
  private updateDebugDisplay() {
    this.debugSvgMapDisplay = this.domSanitize.bypassSecurityTrustHtml(
      this.debugSvgMap.documentElement.outerHTML
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

  splitPathAtPoint(path: SVGPathElement, point: Node): SVGPathElement[] {
    let subpaths: SVGPathElement[] = [];
    let precision = 1;
    let length = path.getTotalLength();
    for (let len = 0; len < length; len += precision) {
      let p = path.getPointAtLength(len);
      if (p.x == point.x && p.y == point.y) {
        let subpath1 = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        let subpath2 = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        let d1 = path.getAttribute('d')!.substring(0, len);
        let d2 = path.getAttribute('d')!.substring(len, path.getTotalLength());
        subpath1.setAttribute('d', d1);
        subpath2.setAttribute('d', d2);
        subpaths.push(subpath1);
        subpaths.push(subpath2);
        break;
      }
    }
    return subpaths;
  }

  loadGroundTransportationGrid(svg: SVGSVGElement): void {
    let ground = new TransportationGrid();

    const pathType = ['road', 'trail'];
    let paths: SVGPathElement[] = [];

    //add all burgs as nodes
    for (let burg of this.world.mapData.burgs) {
      if (burg.x && burg.y) ground.addNode(burg.x, burg.y, burg);
    }
    //find all paths
    for (let type of pathType) {
      paths = paths.concat(this.findAllPaths(type, svg));
    }

    //show nodes on paths
    const points = ground.getNodes();
    for (const point of points) {
      let isPointInStroke;
      for (const p of paths) {
        //force bigger stroke width
        p.style.strokeWidth = '5';
        //no dash
        p.style.strokeDasharray = 'none';
        try {
          const pointObj = new DOMPoint(point.x, point.y);
          isPointInStroke = p.isPointInStroke(pointObj);
        } catch (e) {
          console.log('error', e);
          // Fallback for browsers that don't support DOMPoint as an argument
          const pointObj = svg.createSVGPoint();
          pointObj.x = point.x;
          pointObj.y = point.y;
          isPointInStroke = p.isPointInStroke(pointObj);
        }
        if (isPointInStroke) {
          console.log('in stroke', p.id, ' there is', point.relatedBurg?.name);
          break;
        }
      }
    }

    // for (let path1 of paths) {
    //   for (let path2 of paths) {
    //     if (path1 == path2) {
    //       // console.log('same path');
    //       continue;
    //     }
    //     // let intersection = this.findIntersectionsWithPath(path1, path2);
    //     let intersections = intersect(
    //       path1.getAttribute('d')!,
    //       path2.getAttribute('d')!
    //     );
    //     // console.log('intersection', intersections);
    //     for (let intersection of intersections) {
    //       // console.log(
    //       //   'intersection found between',
    //       //   path1.id,
    //       //   path2.id,
    //       //   intersection
    //       // );
    //       // create intersection as node
    //       let intersectNode = ground.addNode(intersection.x, intersection.y);
    //       let p1_start = path1.getPointAtLength(0);
    //       let p1_end = path1.getPointAtLength(path1.getTotalLength());

    //       let p2_start = path2.getPointAtLength(0);
    //       let p2_end = path2.getPointAtLength(path2.getTotalLength());

    //       ground.addEdge(
    //         ground.getNodeClosestTo(p1_start.x, p1_start.y).id,
    //         intersectNode.id,
    //         intersection.t1 * path1.getTotalLength()
    //       );
    //       ground.addEdge(
    //         ground.getNodeClosestTo(p1_end.x, p1_end.y).id,
    //         intersectNode.id,
    //         path1.getTotalLength() - intersection.t1 * path1.getTotalLength()
    //       );
    //       ground.addEdge(
    //         ground.getNodeClosestTo(p2_start.x, p2_start.y).id,
    //         intersectNode.id,
    //         intersection.t2 * path2.getTotalLength()
    //       );
    //       ground.addEdge(
    //         ground.getNodeClosestTo(p2_end.x, p2_end.y).id,
    //         intersectNode.id,
    //         path2.getTotalLength() - intersection.t2 * path2.getTotalLength()
    //       );
    //     }
    //   }
    // }
    this.ground_grid = ground;
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
