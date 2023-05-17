import { IArea } from "../models/interfaces/Area";


export class CanvasUtils {
  static fillArea(ctx: CanvasRenderingContext2D, area: IArea & {fillStyle: string}) {
    ctx.beginPath();
    ctx.fillStyle = area.fillStyle;
    ctx.fillRect(area.xMin, area.yMin, area.xMax - area.xMin, area.yMax - area.yMin);
    ctx.fill();
    ctx.closePath();
  } 
  
  static strokeArea(ctx: CanvasRenderingContext2D, area: IArea & {strokeStyle: string, lineWidth?: number}) {
    ctx.beginPath();
    ctx.strokeStyle = area.strokeStyle;
    ctx.lineWidth = area.lineWidth || 1;
    ctx.strokeRect(area.xMin, area.yMin, area.xMax - area.xMin, area.yMax - area.yMin);
    ctx.stroke();
    ctx.closePath();
  }
}