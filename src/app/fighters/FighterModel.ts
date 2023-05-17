import { ICoordinate } from "../models/interfaces/Coordinate";
import { RGB } from "../models/types/RGB";
import { Utils } from "../utils/Utils";
import { v4 as uuidv4 } from 'uuid';

interface IMinMax {
  min: number,
  max: number,
}

export interface IFighterModelInput {
  attack: number,
  defense: number,
  meleeDamage?: IMinMax,
  rangedDamage?: IMinMax,
  healthPoints: number,
  speed: number, // 2 артилерия, 3-4 тяжелая пехота, 4-5 средняя пехота, 6-7 - легкая пехота (стрелки 6-7, гладиаторы 7), 8-9 тяжелая кавалерия, 9-10 легкая кавалерия (стрелковая 10)
  quantity: number, // 60 для кавалерии, 90 - стрелки, 120 - пехота
  initiative: number,
  shotQuantity?: number, // ближние 0-2, застрельщики 4, лучники 8-10, пращики 12-15
  currentMorale: number,
  maxMorale: number,
  shotRange?: number, // 4-5 застрельщики, 6-7 лучники, 7-8 пращики, 10-12 артилерия
  onslaught?: number, // % бонус к урону за пройденую клетку, max 100%
  shotAccuracy?: number,
  image: string,
  position?: ICoordinate,
  isReverse: boolean,
}

export abstract class FighterModel {
  protected _id = uuidv4();
  protected attack = 0;
  protected defense = 0;
  protected maxHealthPoints!: number;
  protected currentHealthPoints = this.maxHealthPoints;
  protected _speed!: number;
  protected _quantity!: number;
  protected _initiative!: number;
  protected _currentInitiative: number = this._initiative;
  protected shotQuantity = 0;
  protected currentMorale!: number;
  protected maxMorale!: number;
  protected shotRange = 0;
  protected onslaught = 0;
  protected shotAccuracy = 0;

  protected _image!: string;
  protected _img!: HTMLImageElement;
  protected _isImgLoaded = false;

  protected isHorseman!: boolean;
  protected isInfantryman!: boolean;
  protected isShooter!: boolean;

  position?: ICoordinate;

  protected meleeDamage = {
    min: 0,
    max: 0,
  }

  protected rangedDamage =  {
    min: 0,
    max: 0,
  }

  protected _teamId!: string;
  protected _armyId!: string;
  protected _armyColor!: RGB;
  protected _isReverse: boolean = false;

  constructor(data: IFighterModelInput) {
    if (!data.meleeDamage && !data.rangedDamage) {
      throw new Error('Damage is required');
    }

    if (data.meleeDamage && data.meleeDamage.min && !data.meleeDamage.max) {
      throw new Error('"meleeDamage.max" is required');
    }

    if (data.meleeDamage && !data.meleeDamage.min && data.meleeDamage.max) {
      throw new Error('"meleeDamage.min" is required');
    }

    if (data.rangedDamage && data.rangedDamage.min && !data.rangedDamage.max) {
      throw new Error('"rangedDamage.max" is required');
    }

    if (data.rangedDamage && !data.rangedDamage.min && data.rangedDamage.max) {
      throw new Error('"rangedDamage.min" is required');
    }
    
    this.attack = data.attack;
    this.defense = data.defense;
    this.maxHealthPoints = data.healthPoints;
    this.currentHealthPoints = data.healthPoints;
    this._speed = data.speed;
    this._quantity = data.quantity;
    this._initiative = data.initiative;
    this._currentInitiative = 0 //data.initiative + (Utils.getRandomInt(-100, 100) / 100);
    this.currentMorale = data.currentMorale;
    this.maxMorale = data.maxMorale;
    this._image = data.image;

    if (data.meleeDamage) {
      this.meleeDamage = {
        ...data.meleeDamage,
      }
    }

    if (data.rangedDamage) {
      this.rangedDamage = {
        ...data.rangedDamage,
      }
    }

    if (data.position) {
      this.position = data.position;
    }

    if (data.attack) this.attack = data.attack;
    if (data.defense) this.defense = data.defense;
    if (data.shotQuantity) this.shotQuantity = data.shotQuantity;
    if (data.shotRange) this.shotRange = data.shotRange;
    if (data.onslaught) this.onslaught = data.onslaught;

    this._isReverse = !!data.isReverse;

    let img = new Image();
    img.src = data.image;
    
    img.onload = () => {
      this._isImgLoaded = true;
      this._img = img;
    }
  }

  get id() {
    return this._id;
  }

  get img() {
    return this._img;
  }

  get isImgLoaded() {
    return this._isImgLoaded;
  }

  get speed() {
    return this._speed;
  }

  get quantity() {
    return this._quantity;
  }

  get initiative() {
    return this._initiative;
  }

  get currentInitiative() {
    return this._currentInitiative;
  }

  set teamId(id: string) {
    this._teamId = id;
  }
  set armyId(id: string) {
    this._armyId = id;
  }

  set armyColor(rgb: RGB) {
    this._armyColor = rgb;
  }
}