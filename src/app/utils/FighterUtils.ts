import { FighterModel } from "../fighters/FighterModel";
import { ICell } from "../models/interfaces/Cell";
import { ICoordinate } from "../models/interfaces/Coordinate";
import { Team } from "../team/Team";


type Direction = -1 | 0 | 1;


export class FighterUtils {

  static getAvailableCells(data: {
    fighter: FighterModel,
    teams: Team[],
    X_SIZE: number,
    Y_SIZE: number
  }) {
    const {fighter, teams, X_SIZE, Y_SIZE} = data;
    const distantSpeedCost = Math.sqrt(2);
    const availableCoordinates: (ICoordinate & {availableSpeed: number})[] = [];
    const busyPositions: ICoordinate[] = [];
    
    for (let k = 0, l1 = teams.length; k < l1; k++) {
      for (let n = 0, l2 = teams[k].armies.length; n < l2; n++) {
        for (let m = 0, l3 = teams[k].armies[n].fighters.length; m < l3; m++) {
          busyPositions.push(teams[k].armies[n].fighters[m].position!);
        }
      }
    }
    
    const compute = (currentPos: ICoordinate, availableSpeed: number, direction?: {x: Direction, y: Direction}) => {
      if (currentPos.x < 0 && currentPos.x >= X_SIZE) return;
      if (currentPos.y < 0 && currentPos.y >= Y_SIZE) return;
      if (availableSpeed < 1) return;

      for (let i = 0, l = busyPositions.length; i < l; i++) {
        if (direction && busyPositions[i].x === currentPos.x && busyPositions[i].y === currentPos.y) return;
      }

      const availableCoordinate = availableCoordinates.find(c => c.x === currentPos.x && c.y === currentPos.y);
      if (!availableCoordinate) {
        availableCoordinates.push({
          ...currentPos,
          availableSpeed,
        });
      } else {
        if (availableCoordinate.availableSpeed >= availableSpeed) return;
        availableCoordinate.availableSpeed = availableSpeed;
      }

      if (!direction) {
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            const isNearest = i === 0 || j === 0;
            const aSp = availableSpeed - (isNearest ? 1 : distantSpeedCost);
            if (aSp < 1) continue;
            !(i === 0 && j === 0) && compute(
              {x: currentPos.x + i, y: currentPos.y + j}, 
              aSp,
              {x: i, y: j} as any,
            );
          }
        }

        return;
      }

      const computeTopLeftDirection = () => {
        compute(
          {x: currentPos.x - 1, y: currentPos.y - 1}, 
          availableSpeed - distantSpeedCost,
          {x: -1, y: -1},
        );
      }

      const computeTopDirection = () => {
        compute(
          {x: currentPos.x, y: currentPos.y - 1}, 
          availableSpeed - 1,
          {x: 0, y: -1},
        );
      }

      const computeTopRightDirection = () => {
        compute(
          {x: currentPos.x + 1, y: currentPos.y - 1}, 
          availableSpeed - distantSpeedCost,
          {x: 1, y: -1},
        );
      }

      const computeRightDirection = () => {
        compute(
          {x: currentPos.x + 1, y: currentPos.y}, 
          availableSpeed - 1,
          {x: 1, y: 0},
        );
      }

      const computeBottomRightDirection = () => {
        compute(
          {x: currentPos.x + 1, y: currentPos.y + 1}, 
          availableSpeed - distantSpeedCost,
          {x: 1, y: 1},
        );
      }

      const computeBottomDirection = () => {
        compute(
          {x: currentPos.x, y: currentPos.y + 1}, 
          availableSpeed - 1,
          {x: 0, y: 1},
        );
      }

      const computeBottomLeftDirection = () => {
        compute(
          {x: currentPos.x - 1, y: currentPos.y + 1}, 
          availableSpeed - distantSpeedCost,
          {x: -1, y: 1},
        );
      }

      const computeLeftDirection = () => {
        compute(
          {x: currentPos.x - 1, y: currentPos.y}, 
          availableSpeed - 1,
          {x: -1, y: 0},
        );
      }

      if (direction.x === 0 && direction.y === -1) {
        computeTopLeftDirection();
        computeTopDirection();
        computeTopRightDirection();
      }

      if (direction.x === 1 && direction.y === -1) {
        computeTopDirection();
        computeTopRightDirection();
        computeRightDirection();
      }

      if (direction.x === 1 && direction.y === 0) {
        computeTopRightDirection();
        computeRightDirection();
        computeBottomRightDirection();
      }

      if (direction.x === 1 && direction.y === 1) {
        computeRightDirection();
        computeBottomRightDirection();
        computeBottomDirection();
      }

      if (direction.x === 0 && direction.y === 1) {
        computeBottomRightDirection();
        computeBottomDirection();
        computeBottomLeftDirection();
      }

      if (direction.x === -1 && direction.y === 1) {
        computeBottomDirection();
        computeBottomLeftDirection();
        computeLeftDirection();
      }

      if (direction.x === -1 && direction.y === 0) {
        computeBottomLeftDirection();
        computeLeftDirection();
        computeTopLeftDirection();
      }

      if (direction.x === -1 && direction.y === -1) {
        computeLeftDirection();
        computeTopLeftDirection();
        computeTopDirection();
      }
    }
    
    compute(fighter.position!, fighter.speed + 1);
    return availableCoordinates;
  }
}