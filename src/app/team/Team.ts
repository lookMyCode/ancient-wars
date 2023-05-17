import { v4 as uuidv4 } from 'uuid';
import { Army } from '../army/Army';


export class Team {
  private _id = uuidv4();
  armies: Army[] = [];

  constructor(data: {armies: Army[], isReverse?: boolean}) {
    this.armies = data.armies;
    this.armies.forEach(army => {
      army.teamId = this._id;
    });
  }
}