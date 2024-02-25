import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TravelDetails, Vehicle } from '../../models/vehicule';
import { WorldService } from '../../services/world.service';

@Component({
  selector: 'app-vehicule-card-detailed',
  templateUrl: './vehicule-card-detailed.component.html',
  styleUrls: ['./vehicule-card-detailed.component.scss'],
})
export class VehiculeCardDetailedComponent implements OnChanges {
  @Input() vehicule!: Vehicle;

  travel!: TravelDetails;

  constructor(private readonly worldService: WorldService) {}

  ngOnChanges(): void {
    this.travel = this.vehicule.getTravelDetails(this.worldService.currentBurg);
  }
}
