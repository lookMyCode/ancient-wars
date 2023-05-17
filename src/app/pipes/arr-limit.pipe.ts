import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrLimit'
})
export class ArrLimitPipe implements PipeTransform {

  transform<T>(arr: T[], limit: number): T[] {
    const result: T[] = [];

    for (let i = 0, l = Math.min(arr.length, limit); i < l; i++) {
      result.push(arr[i]);
    }

    return result;
  }

}
