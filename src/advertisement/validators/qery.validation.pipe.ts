import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class QueryValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error, value: validatedValue } = this.schema.validate(value, {
      stripUnknown: true,
    });

    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    return validatedValue;
  }
}
