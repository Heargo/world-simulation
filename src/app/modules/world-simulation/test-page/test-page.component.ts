import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WorldService } from '../../../core/services/world/world.service';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Node } from '../../../core/models/world/transportation-grid';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
  @ViewChild('canva') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    public readonly worldService: WorldService,
    private readonly domSanitize: DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    await firstValueFrom(
      this.worldService.loadWorld('assets/maps/default-map.json')
    );
    await firstValueFrom(
      this.worldService.loadSvgMap('assets/maps/default-map.svg')
    );
  }

  onSvgRendered() {
    const container = document.getElementById('svg-map-container')!;
    const svg = container.querySelector('svg')!;

    this.worldService.loadTransportationGrids(svg);
    this.worldService.loadComplete = true;

    let p = this.worldService.getPathBetweenBurgs('Viciglio', 'Monano');
    console.log('path between ', p);

    this.drawGrid();
  }

  drawNode(
    ctx: CanvasRenderingContext2D,
    pos: number[],
    color: string = 'black',
    radius: number = 5
  ) {
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  convertPositionToCanvas(
    rawPos: number[],
    rawSize: number[],
    canvasSize: number[]
  ) {
    let x = rawPos[0];
    let y = rawPos[1];
    let w = rawSize[0];
    let h = rawSize[1];
    let canvaW = canvasSize[0];
    let canvaH = canvasSize[1];
    let newX = (x / w) * canvaW;
    let newY = (y / h) * canvaH;
    return [newX, newY];
  }

  drawGrid() {
    const mapSize = [1536, 703];
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    //draw all nodes
    let nodes = this.worldService.ground_grid.getConnectedNodes();
    let unconnectedNodes = this.worldService.ground_grid.getUnconnectNode();

    nodes.forEach(node => {
      //adapt node position to fit canvas size
      let newPos = this.convertPositionToCanvas([node.x, node.y], mapSize, [
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height,
      ]);
      //red if unconnected red, green if a burg is related to the node else black
      if (unconnectedNodes.includes(node)) {
        this.drawNode(ctx, newPos, 'red', 3);
      } else {
        let connected = this.worldService.ground_grid.getNodeConnections(
          node.id
        );
        let colors = ['black', 'green', 'blue', 'purple', 'orange', 'yellow'];
        this.drawNode(ctx, newPos, colors[connected.length], 3);
      }
      //draw name of the node above the node
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(
        node.id.toString() + ' ' + node.relatedBurg?.name,
        newPos[0],
        newPos[1] - 10
      );
    });
    let edges = this.worldService.ground_grid.getEdges();

    edges.forEach(edge => {
      let start = this.worldService.ground_grid.getNode(edge.nodes[0])!;
      let end = this.worldService.ground_grid.getNode(edge.nodes[1])!;
      ctx.beginPath();
      let canvasStart = this.convertPositionToCanvas(
        [start.x, start.y],
        mapSize,
        [this.canvas.nativeElement.width, this.canvas.nativeElement.height]
      );
      let canvasEnd = this.convertPositionToCanvas([end.x, end.y], mapSize, [
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height,
      ]);
      ctx.moveTo(canvasStart[0], canvasStart[1]);
      ctx.lineTo(canvasEnd[0], canvasEnd[1]);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }
}
