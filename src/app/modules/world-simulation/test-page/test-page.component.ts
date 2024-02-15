import { Component, OnInit } from '@angular/core';
import { WorldService } from '../../../core/services/world/world.service';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
  constructor(
    public readonly worldService: WorldService,
    private readonly domSanitize: DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    await firstValueFrom(
      this.worldService.loadWorld('assets/maps/default-map.json')
    );
    await firstValueFrom(
      this.worldService.loadSvgMap('assets/maps/default-map.svg')
    );
    let length = this.worldService.getPathLength('trail133');
    console.log(length);

    // let tr_grid = new TransportationGrid();
    // tr_grid.addNode(0, 0);
    // tr_grid.addNode(1, 0);
    // tr_grid.addNode(2, 0);
    // tr_grid.addNode(3, 0);

    // tr_grid.addEdge(0, 1, 5);
    // tr_grid.addEdge(0, 2, 8);
    // tr_grid.addEdge(1, 2, 9);
    // tr_grid.addEdge(2, 3, 6);
    // tr_grid.addEdge(1, 3, 2);
    // let path = tr_grid.shortestPath(0, 3);
    // console.log(path);
  }

  onSvgRendered() {
    console.log('svg rendered');
    const container = document.getElementById('svg-map-container')!;

    const svg = container.querySelector('svg')!;
    console.log('svg', svg);

    this.worldService.loadGroundTransportationGrid(svg);
    let p = this.worldService.getPathBetweenBurgs('Oziepieds', 'Nympsostias');
    console.log('path between Oziepieds and Nympsostias', p);
  }
}