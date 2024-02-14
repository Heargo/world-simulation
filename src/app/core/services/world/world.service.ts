import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, take } from 'rxjs';
import { BiomesData, Burg, MapData, World } from '../../models/world/world';
import { WorldRaw } from '../../models/world/world-raw';

@Injectable({
  providedIn: 'root',
})
export class WorldService {
  world!: World;

  svgMap!: Document;

  constructor(private readonly http: HttpClient) {}

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
    console.log(path);
    if (path) {
      return path.getTotalLength();
    }
    return 0;
  }

  findCityWithPath(): Burg | undefined {
    let cells = this.world.mapData.cells;
    let burg: Burg | undefined = undefined;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].road > 0) {
        console.log('found burg with path', cells[i].road);
        burg = this.world.mapData.burgs.find(b => b.i == cells[i].burg)!;
      }
    }
    return burg;
  }
}
