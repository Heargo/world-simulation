import { Component, Input } from '@angular/core';
import { Burg } from '../../models/burg';

@Component({
  selector: 'app-burg-card',
  templateUrl: './burg-card.component.html',
  styleUrls: ['./burg-card.component.scss'],
})
export class BurgCardComponent {
  @Input() burg!: Burg;
}
