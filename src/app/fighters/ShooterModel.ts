import { HORSEMAN_QTY, SHOOTER_QTY } from "../models/constants/fighterQuantities";
import { FighterModel } from "./FighterModel";


export abstract class ShooterModel extends FighterModel {

  constructor(data: any) {
    super({
      ...data,
      quantity: SHOOTER_QTY,
    });
    
    this.isHorseman = false;
    this.isInfantryman = false;
    this.isShooter = false;
  }
}