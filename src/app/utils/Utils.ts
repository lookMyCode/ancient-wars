export class Utils {

  static copy<T>(data: T): T {
    if (!data) return data;
    if (typeof(data) !== 'object') return data;
    return JSON.parse(JSON.stringify(data));
  }

  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}