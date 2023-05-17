import { v4 as uuidv4 } from 'uuid';
import { FighterModel } from '../fighters/FighterModel';
import { RGB } from '../models/types/RGB';


export class Army {
  private _id = uuidv4();
  private _color!: RGB;
  private _teamId!: string;
  fighters: FighterModel[] = [];

  constructor(data: {color: RGB, fighters: FighterModel[]}) {
    this._color = data.color;
    this.fighters = data.fighters;
    this.fighters.forEach(fighter => {
      fighter.armyColor = this._color;
      fighter.armyId = this._id;
      if (this._teamId) {
        fighter.teamId = this._teamId;
      }
    });
  }

  set teamId(id: string) {
    this._teamId = id;
    this.fighters.forEach(fighter => {
      fighter.teamId = this._teamId;
    });
  }

  get color() {
    return this._color;
  }
}