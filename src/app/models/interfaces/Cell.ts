import { ICoordinate } from "./Coordinate";


export interface ICell {
  top: number,
  bottom: number,
  left: number,
  right: number,
  width: number,
  height: number,
  mouseOver?: boolean,
  availableForGoing?: boolean,
  availableForGoingPreview?: boolean,
  position: ICoordinate,
}
