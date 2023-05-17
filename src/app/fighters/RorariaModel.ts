import { ICoordinate } from "../models/interfaces/Coordinate";
import { SpearmenModel } from "./SpearmenModel";


export class RorariaModel extends SpearmenModel {

  constructor(data: {position?: ICoordinate, isReverse?: boolean}) {
    super({
      attack: 20,
      defense: 30,
      meleeDamage: {
        min: 10,
        max: 15,
      },
      healthPoints: 35,
      initiative: 10,
      currentMorale: 45,
      maxMorale: 75,
      onslaught: 4,
      image: data.isReverse ? 'http://localhost:4200/assets/images/Roraria-reverse.png' : 'http://localhost:4200/assets/images/Roraria.png',
      speed: 4,
      ...data,
    });

    this.isShooter = false;
  }
}