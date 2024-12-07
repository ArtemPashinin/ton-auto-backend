import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError, UniqueConstraintError } from 'sequelize';

@Catch(ValidationError, UniqueConstraintError)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      status: 'error',
      message: 'This user already exists',
    });
  }
}
