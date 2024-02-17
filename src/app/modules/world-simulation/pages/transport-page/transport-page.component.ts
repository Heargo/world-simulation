import { Component, OnInit } from '@angular/core';
import { BaseAppComponent } from '../../../../core/components/base-app/base-app.component';
import { TransportService } from '../../services/transports.service';
import { Vehicle } from '../../models/vehicule';
import { WorldService } from '../../services/world.service';
import { Observable, map, timer } from 'rxjs';

@Component({
  selector: 'app-transport-page',
  templateUrl: './transport-page.component.html',
  styleUrls: ['./transport-page.component.scss'],
})
export class TransportPageComponent extends BaseAppComponent implements OnInit {
  vehiculesInBurg$!: Observable<Vehicle[]>;
  constructor(
    private readonly worldService: WorldService,
    private readonly transportService: TransportService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.vehiculesInBurg$ = new Observable<Vehicle[]>(observer => {
    //   let interval = setInterval(() => {
    //     observer.next(
    //       this.transportService.getCarriagesByBurg(
    //         this.worldService.currentBurg
    //       )
    //     );
    //   }, 2 * 1000);
    //   return () => {
    //     clearInterval(interval);
    //   };
    // });
    this.vehiculesInBurg$ = timer(0, 2 * 1000).pipe(
      map(() =>
        this.transportService.getCarriagesByBurg(this.worldService.currentBurg)
      )
    );
  }
}
