import { HORSEMAN_QTY, INFANTRYMAN_QTY, SHOOTER_QTY } from "../models/constants/fighterQuantities";
import { FighterModel } from "./FighterModel";


export abstract class SpearmenModel extends FighterModel {

  constructor(data: any) {
    super({
      ...data,
      quantity: INFANTRYMAN_QTY,
    });
    
    this.isHorseman = false;
    this.isInfantryman = true;
    this.isShooter = false;
  }
}