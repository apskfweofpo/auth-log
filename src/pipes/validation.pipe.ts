import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private readonly logger = new MyLoggerService();

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      let messages = errors.map((err) => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      });
      this.logger.error(`ValidationExceptions: ${messages}`);
      throw new ValidationException(messages);
    }
    return value;
  }
}
