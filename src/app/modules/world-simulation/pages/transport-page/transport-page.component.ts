import { Component, OnInit } from '@angular/core';
import { BaseAppComponent } from '../../../../core/components/base-app/base-app.component';
import { TransportService } from '../../services/transports.service';

@Component({
  selector: 'app-transport-page',
  templateUrl: './transport-page.component.html',
  styleUrls: ['./transport-page.component.scss'],
})
export class TransportPageComponent extends BaseAppComponent implements OnInit {
  constructor(private readonly transportService: TransportService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.transportService.carriages);
  }
}
