import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss'],
})
export class InventoryPageComponent {
  constructor(public readonly playerService: PlayerService) {}
}
