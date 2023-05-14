import { IArea } from "../models/interfaces/Area";


export class CanvasUtils {
  static fillArea(ctx: CanvasRenderingContext2D, area: IArea & {fillStyle: string}) {
    ctx.beginPath();
    ctx.fillStyle = area.fillStyle;
    ctx.fillRect(area.xMin, area.yMin, area.xMax - area.xMin, area.yMax - area.yMin);
    ctx.fill();
    ctx.closePath();
  } 
  
  static strokeArea(ctx: CanvasRenderingContext2D, area: IArea & {strokeStyle: string}) {
    ctx.beginPath();
    ctx.strokeStyle = area.strokeStyle;
    ctx.strokeRect(area.xMin, area.yMin, area.xMax - area.xMin, area.yMax - area.yMin);
    ctx.stroke();
    ctx.closePath();
  }
}