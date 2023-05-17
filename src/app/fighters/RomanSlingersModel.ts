import { ICoordinate } from "../models/interfaces/Coordinate";
import { ShooterModel } from "./ShooterModel";


export class RomanSlingersModel extends ShooterModel {

  constructor(data: {position?: ICoordinate, isReverse?: boolean}) {
    super({
      attack: 10,
      defense: 5,
      meleeDamage: {
        min: 5,
        max: 8,
      },
      healthPoints: 20,
      initiative: 15,
      currentMorale: 40,
      maxMorale: 70,
      onslaught: 0,
      image: data.isReverse ? 'http://localhost:4200/assets/images/RomanSlingers-reverse.png' : 'http://localhost:4200/assets/images/RomanSlingers.png',
      speed: 7,
      ...data,
    });

    this.isShooter = false;
  }
}