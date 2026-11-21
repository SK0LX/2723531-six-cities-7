import {IsIn, IsString, Length} from 'class-validator';
import {USER_TYPES} from '../../../types/index.js';
import type {UserType} from '../../../types/index.js';
import {LoginUserDto} from './login-user.dto.js';

export class CreateUserDto extends LoginUserDto {
  @IsString()
  @Length(1, 15)
  public name!: string;

  public avatarPath?: string;

  @IsIn(USER_TYPES)
  public type!: UserType;
}
