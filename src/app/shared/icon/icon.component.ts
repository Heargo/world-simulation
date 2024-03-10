import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements AfterViewInit {
  //template ref

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  @Input() name!: string;
  @Input() pixelated: boolean = false;
  @Input() dim: number[] = [16, 16];

  @HostBinding('style.width')
  @HostBinding('style.height')
  @Input()
  size: string = '2rem';

  ngAfterViewInit(): void {
    // Load image
    const image = new Image();
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    image.onload = () => {
      // Draw the image into the canvas
      ctx.drawImage(image, 0, 0);
    };
    image.src = 'assets/icons/' + this.name + '.png';
  }
}
