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
  speed: number, // 2-3 артилерия, 4-5 тяжелая пехота, 5-6 средняя пехота, 6-9 - легкая пехота (стрелки 6-8, гладиаторы 9), 9-10 тяжелая кавалерия, 10-12 легкая кавалерия (стрелковая 10-11)
  quantity: number, // 60 для кавалерии, 90 - стрелки, 120 - пехота
  initiative: number,
  shotQuantity?: number, // ближние 0-2, застрельщики 4, лучники 8-10, пращики 12-15
  currentMorale: number,
  maxMorale: number,
  shotRange?: number, // 5-6 застрельщики, 7-9 лучники, 9-11 пращики, 14-16 артилерия
  onslaught?: number, // % бонус к урону за пройденую клетку, max 100%
  shotAccuracy?: number,
  image: string,
}

export abstract class FighterModel {
  protected attack = 0;
  protected defense = 0;
  protected maxHealthPoints!: number;
  protected currentHealthPoints = this.maxHealthPoints;
  protected _speed!: number;
  protected quantity!: number;
  protected initiative!: number;
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

  protected meleeDamage = {
    min: 0,
    max: 0,
  }

  protected rangedDamage =  {
    min: 0,
    max: 0,
  }

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
    this.quantity = data.quantity;
    this.initiative = data.initiative;
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

    if (data.attack) this.attack = data.attack;
    if (data.defense) this.defense = data.defense;
    if (data.shotQuantity) this.shotQuantity = data.shotQuantity;
    if (data.shotRange) this.shotRange = data.shotRange;
    if (data.onslaught) this.onslaught = data.onslaught;

    const img = new Image();
    img.src  = data.image;
    
    img.onload = () => {
      this._isImgLoaded = true;
      this._img = img;
    }
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
}