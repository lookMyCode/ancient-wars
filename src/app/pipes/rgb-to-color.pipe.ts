import { Pipe, PipeTransform } from '@angular/core';
import { RGB } from '../models/types/RGB';

@Pipe({
  name: 'rgbToColor'
})
export class RgbToColorPipe implements PipeTransform {

  transform(rgb: RGB, opacity: number = 1): string {
    if (!rgb?.length) rgb = [] as any;
    rgb = rgb.map(x => x || 0) as RGB;
    return `rgba(${rgb.join(',')}, ${opacity})`;
  }

}
