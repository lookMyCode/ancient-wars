import { HORSEMAN_QTY } from "../models/constants/fighterQuantities";
import { FighterModel } from "./FighterModel";


export abstract class HorsemanModel extends FighterModel {

  constructor(data: any) {
    super({
      ...data,
      quantity: HORSEMAN_QTY,
    });
    
    this.isHorseman = true;
    this.isInfantryman = false;
  }
}