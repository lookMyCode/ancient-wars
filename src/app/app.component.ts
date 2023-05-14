import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CanvasUtils } from './utils/CanvasUtils';
import {BATTLEFIELD_CANVAS_FILL_COLOR, CELL_STROKE_COLOR} from './models/constants/colors';
import { v4 as uuidv4 } from 'uuid';
import { FighterModel } from './fighters/FighterModel';
import { HorsemanModel } from './fighters/HorsemanModel';
import { RomanHorsemanModel } from './fighters/RomanHorsemanModel';


interface ICoordinate {
  x: number,
  y: number,
}

interface ICell {
  top: number,
  bottom: number,
  left: number,
  right: number,
  width: number,
  height: number,
  mouseOver?: boolean,
  availableForGoing?: boolean,
  position: ICoordinate,
}

interface IFighterItem {
  position: ICoordinate,
  fighter: FighterModel
}

interface IArmy {
  id: string,
  fighters: IFighterItem[]
}

interface ITeam {
  id: string,
  armies: IArmy[]
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  readonly DPI_WIDTH = 1440;
  readonly DPI_HEIGHT = 1440;
  readonly X_SIZE = 16;
  readonly Y_SIZE = 16;

  @ViewChild('battlefieldCanvas') declare battlefieldCanvasRef: ElementRef<HTMLCanvasElement>;

  declare private ctx: CanvasRenderingContext2D;
  declare private proxy: any;
  declare private raf: number;
  
  declare private canvasRect: DOMRect;

  declare private canvasLeft: number;
  declare private canvasTop: number;
  declare private canvasWidth: number;
  declare private canvasHeight: number;

  declare private dpiInPxX: number;
  declare private dpiInPxY: number;

  private cells: ICell[] = [];

  teams: ITeam[] = [
    {
      id: uuidv4(),
      armies: [
        {
          id: uuidv4(),
          fighters: [
            {
              position: {
                x: 1,
                y: 1,
              },
              fighter: new RomanHorsemanModel(),
            }
          ],
        },
      ],
    },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    this.init();
    this.renderTeams();
  }

  @HostListener('window:load', [])
  onWindowLoad() {
    this.computeMetrix();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.computeMetrix();
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    this.computeMetrix();
  }

  mousemove = (e: MouseEvent) => {
    const {offsetX, offsetY} = e;
    const offsetXDpi = offsetX * this.dpiInPxX;
    const offsetYDpi = offsetY * this.dpiInPxY;

    for (let i = 0, l = this.cells.length; i < l; i++) {
      const c = this.cells[i];
      const inX = c.left <= offsetXDpi && (c.left + c.width) > offsetXDpi;
      const inY = c.top <= offsetYDpi && (c.top + c.height) > offsetYDpi;

      c.mouseOver = inX && inY;
    }

    this.proxy.mouse = {
      x: Math.round(offsetX * this.dpiInPxX),
      y: Math.round(offsetY * this.dpiInPxY),
    }
  }

  mouseout = (e: MouseEvent) => {}

  private init() {
    const that: AppComponent = this;
    this.ctx = this.battlefieldCanvasRef.nativeElement.getContext('2d')!;
    this.proxy = new Proxy({} as any, {
      set(...args): boolean {
        const result: boolean = Reflect.set(...args);
        that.raf = requestAnimationFrame(() => {
          that.paint.call(that);
          that.renderTeams.call(that);
        });
        return result;
      }
    });

    let yPos = 0;
    let yDpis = this.DPI_HEIGHT;

    while (yPos < this.Y_SIZE) {
      let xPos = 0;
      let xDpis = this.DPI_WIDTH;

      const height = Math.round(yDpis / (this.Y_SIZE - yPos));
      const top = yPos * height;
      const bottom = this.DPI_HEIGHT - (top + height - 1);

      while (xPos < this.X_SIZE) {
        const width = Math.round(xDpis / (this.X_SIZE - xPos));
        const left = xPos * width;
        const right = this.DPI_WIDTH - (left + width - 1);

        this.cells.push({
          top,
          bottom,
          left,
          right,
          width,
          height,
          position: {
            x: xPos,
            y: yPos,
          }
        });

        xDpis = xDpis - width;
        ++xPos;
      }
      
      yDpis = yDpis - height;
      ++yPos;
    }
    
    this.paint();
  }

  private paint() {
    this.clear();

    CanvasUtils.fillArea(this.ctx, {
      xMin: 0,
      xMax: this.DPI_WIDTH,
      yMin: 0,
      yMax: this.DPI_HEIGHT,
      fillStyle: BATTLEFIELD_CANVAS_FILL_COLOR,
    });

    for (let i = 0, l = this.cells.length; i < l; i++) {
      const cell = this.cells[i];
      CanvasUtils.strokeArea(this.ctx, {
        xMin: cell.left,
        xMax: cell.left + cell.width - 1,
        yMin: cell.top,
        yMax: cell.top + cell.height - 1,
        strokeStyle: CELL_STROKE_COLOR,
      });

      if (cell.mouseOver) {
        CanvasUtils.fillArea(this.ctx, {
          xMin: cell.left,
          xMax: cell.left + cell.width - 1,
          yMin: cell.top,
          yMax: cell.top + cell.height - 1,
          fillStyle: 'rgba(0, 0, 0, 0.05)',
        });
      }

      if (cell.availableForGoing) {
        CanvasUtils.fillArea(this.ctx, {
          xMin: cell.left,
          xMax: cell.left + cell.width - 1,
          yMin: cell.top,
          yMax: cell.top + cell.height - 1,
          fillStyle: 'rgba(0, 0, 0, 0.05)',
        });
      }
    }
    
    this.cdr.detectChanges();
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.DPI_WIDTH, this.DPI_HEIGHT);
  }

  private computeMetrix() {
    this.canvasRect = this.battlefieldCanvasRef.nativeElement.getBoundingClientRect();

    this.canvasLeft = this.canvasRect.left;
    this.canvasTop = this.canvasRect.top;
    this.canvasWidth = this.canvasRect.width;
    this.canvasHeight = this.canvasRect.height;

    this.dpiInPxX = this.DPI_WIDTH / this.canvasWidth;
    this.dpiInPxY = this.DPI_HEIGHT / this.canvasHeight;
  }

  private renderTeams() {
    for (let i = 0, l1 = this.teams.length; i < l1; i++) {
      for (let j = 0, l2 = this.teams[i].armies.length; j < l2; j++) {
        for (let k = 0, l3 = this.teams[i].armies[j].fighters.length; k < l3; k++) {
          const fighter = this.teams[i].armies[j].fighters[k];
          if (!fighter.fighter.isImgLoaded) {
            window.setTimeout(this.renderTeams.bind(this), 20);
            return;
          }

          const img = fighter.fighter.img;
          const cell = this.cells.find(c => c.position.x === fighter.position.x && c.position.y === fighter.position.y);
          if (!cell) throw new Error('Cell not found');

          const size = Math.min(cell.width, cell.height);
          const xPrefix = (cell.width - size) / 2;
          const yPrefix = (cell.height - size) / 2;

          this.ctx.drawImage(img, cell.left + xPrefix, cell.top + yPrefix, size, size);
          this.computeAvailableCells(fighter);
        }
      }
    }
  }

  private computeAvailableCells(fighter: IFighterItem) {
    const distantSpeedCost = Math.sqrt(2);
    const availableCoordinates: ICoordinate[] = [];
    const compute = (currentPos: ICoordinate, availableSpeed: number) => {
      if (availableCoordinates.findIndex(c => c.x === currentPos.x && c.y === currentPos.y) >= 0) return;
      if (availableSpeed < 1) return;
      availableCoordinates.push(currentPos);

      const neighboringX: number[] = [];
      const neighboringY: number[] = [];
      const nearestNeighboringСells: ICoordinate[] = [];
      const distantNeighboringСells: ICoordinate[] = [];

      for (let i = -1; i <= 1; i++) {
        const x = currentPos.x + i;
        const y = currentPos.y + i;

        if (x >= 0 && x < this.X_SIZE) {
          neighboringX.push(x);
        }

        if (y >= 0 && y < this.Y_SIZE) {
          neighboringY.push(y);
        }
      }

      for (let i = 0, lx = neighboringX.length; i < lx; i++) {

        for (let j = 0, ly = neighboringY.length; j < ly; j++) {
          let isBusy = false;

          for (let k = 0, l1 = this.teams.length; k < l1; k++) {
            for (let n = 0, l2 = this.teams[k].armies.length; n < l2; n++) {
              for (let m = 0, l3 = this.teams[k].armies[n].fighters.length; m < l3; m++) {
                const f = this.teams[k].armies[n].fighters[m];
                if (f.position.x === neighboringX[i] && f.position.y === neighboringY[j]) {
                  isBusy = true;
                }

                if (isBusy) {
                  continue;
                }
              }

              if (isBusy) {
                continue;
              }
            }

            if (isBusy) {
              continue;
            }
          }

          if (isBusy) {
            continue;
          }

          const isNearest = neighboringX[i] === currentPos.x || neighboringY[j] === currentPos.y;
          if (isNearest) {
            nearestNeighboringСells.push({
              x: neighboringX[i],
              y: neighboringY[j],
            });

            continue;
          }

          
          if (availableSpeed >= distantSpeedCost) {
            distantNeighboringСells.push({
              x: neighboringX[i],
              y: neighboringY[j],
            });
          }
        }
      }

      for (let i = 0, l = nearestNeighboringСells.length; i < l; i++) {
        compute(nearestNeighboringСells[i], availableSpeed - 1);
      }

      for (let i = 0, l = distantNeighboringСells.length; i < l; i++) {
        compute(distantNeighboringСells[i], availableSpeed - distantSpeedCost);
      }
    }
    
    compute(fighter.position, fighter.fighter.speed);

    for (let i = 0, l = availableCoordinates.length; i < l; i++) {
      const cell = this.cells.find(c => c.position.x === availableCoordinates[i].x && c.position.y === availableCoordinates[i].y);
      if (!cell) continue;

      cell.availableForGoing = true;
    }
  }
}
