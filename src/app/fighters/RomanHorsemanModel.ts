import { IFighterModelInput } from "./FighterModel";
import { HorsemanModel } from "./HorsemanModel";


export class RomanHorsemanModel extends HorsemanModel {

  constructor() {
    super({
      attack: 20,
      defense: 20,
      meleeDamage: {
        min: 10,
        max: 20,
      },
      healthPoints: 50,
      initiative: 10,
      currentMorale: 60,
      maxMorale: 90,
      onslaught: 10,
      image: 'http://localhost:4200/assets/images/RomanHorseman.png',
      speed: 10,
    });

    this.isShooter = false;
  }
}