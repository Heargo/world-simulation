import { Component, OnInit } from '@angular/core';
import { BaseAppComponent } from '../../../../core/components/base-app/base-app.component';
import { TransportService } from '../../services/transports.service';
import { Vehicle } from '../../models/vehicule';
import { WorldService } from '../../services/world.service';
import { Observable, map, timer } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { RAW_RESOURCES } from '../../data/resources';

@Component({
  selector: 'app-transport-page',
  templateUrl: './transport-page.component.html',
  styleUrls: ['./transport-page.component.scss'],
})
export class TransportPageComponent extends BaseAppComponent implements OnInit {
  vehiculesInBurg$!: Observable<Vehicle[]>;
  constructor(
    private readonly worldService: WorldService,
    private readonly transportService: TransportService,
    private readonly playerService: PlayerService
  ) {
    super();
  }

  ngOnInit(): void {
    let burg = this.worldService.currentBurg;
    console.log(
      'there is ',
      this.transportService.carriages[burg.id].length,
      ' carriages going through ',
      burg.name,
      this.transportService.carriages[burg.id]
    );
    this.vehiculesInBurg$ = timer(0, 1 * 1000).pipe(
      map(() =>
        this.transportService.getCarriagesByBurg(this.worldService.currentBurg)
      )
    );

    this.playerService.harvest(RAW_RESOURCES['wood']);

    //wait 1.5 seconds and start harvesting stone
    setTimeout(() => {
      this.playerService.harvest(RAW_RESOURCES['stone']);
    }, 1.5 * 1000);
  }
}
