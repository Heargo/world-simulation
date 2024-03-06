import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() name!: string;

  @HostBinding('style.width')
  @HostBinding('style.height')
  @Input()
  size: string = '2rem';
}
