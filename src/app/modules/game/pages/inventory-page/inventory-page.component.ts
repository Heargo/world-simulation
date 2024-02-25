import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/player';
import { ResourceType } from '../../models/resources';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss'],
})
export class InventoryPageComponent implements OnInit {
  player!: Player;
  selectedCategory?: ResourceType;
  //list of all enum values
  tabs: ResourceType[] = Object.values(ResourceType);
  constructor(public readonly playerService: PlayerService) {}

  ngOnInit(): void {
    this.player = this.playerService.player;
    //select first category available
    let all = Object.values(ResourceType);
    for (let type of all) {
      if (this.player.inventory.resourcesTypes.includes(type)) {
        this.selectedCategory = type;
        break;
      }
    }
  }
}
