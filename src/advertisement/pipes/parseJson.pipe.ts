import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value.data === 'string') {
      try {
        value.data = JSON.parse(value.data);
      } catch (error) {
        throw new BadRequestException('Invalid JSON string');
      }
    }
    return JSON.parse(value.data);
  }
}
