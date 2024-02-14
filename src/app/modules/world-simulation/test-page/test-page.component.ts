import { Component, OnInit } from '@angular/core';
import { WorldService } from '../../../core/services/world/world.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
  constructor(private readonly worldService: WorldService) {}

  async ngOnInit(): Promise<void> {
    await firstValueFrom(
      this.worldService.loadWorld('assets/maps/default-map.json')
    );
    await firstValueFrom(
      this.worldService.loadSvgMap('assets/maps/default-map.svg')
    );
    let length = this.worldService.getPathLength('trail133');
    console.log(length);

    let burgs = this.worldService.findCityWithPath();
    console.log(burgs);
  }
}
