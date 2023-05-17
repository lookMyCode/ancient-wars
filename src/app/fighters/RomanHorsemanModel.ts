import { ICoordinate } from "../models/interfaces/Coordinate";
import { HorsemanModel } from "./HorsemanModel";


export class RomanHorsemanModel extends HorsemanModel {

  constructor(data: {position?: ICoordinate, isReverse?: boolean}) {
    super({
      attack: 20,
      defense: 20,
      meleeDamage: {
        min: 10,
        max: 20,
      },
      healthPoints: 50,
      initiative: 20,
      currentMorale: 60,
      maxMorale: 90,
      onslaught: 10,
      image: data.isReverse ? 'http://localhost:4200/assets/images/RomanHorseman-reverse.png' : 'http://localhost:4200/assets/images/RomanHorseman.png',
      speed: 9,
      ...data,
    });

    this.isShooter = false;
  }
}