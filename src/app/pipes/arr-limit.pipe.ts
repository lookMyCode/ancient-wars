import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrLimit'
})
export class ArrLimitPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
