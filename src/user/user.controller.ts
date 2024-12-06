import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './interfaces/dto/user.dto';
import { UserValidationPipe } from './validators/user.validation.pipe';
import { userSchema } from './validators/schemas/user.schema';
import { UserModel } from './models/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  public async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOneById(id);
  }

  @Post()
  public async createOne(
    @Body(new UserValidationPipe(userSchema)) body: UserDto,
  ): Promise<UserModel> {
    return await this.userService.createOne(body);
  }
}
