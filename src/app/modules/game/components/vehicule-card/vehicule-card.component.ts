import { Component, Input } from '@angular/core';
import { Vehicle } from '../../models/vehicule';
import { WorldService } from '../../services/world.service';

@Component({
  selector: 'app-vehicule-card',
  templateUrl: './vehicule-card.component.html',
  styleUrls: ['./vehicule-card.component.scss'],
})
export class VehiculeCardComponent {
  @Input() vehicule!: Vehicle;

  constructor(public readonly worldService: WorldService) {}
}
