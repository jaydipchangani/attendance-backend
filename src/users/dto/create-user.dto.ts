import { Department } from '@prisma/client';
import { IsString, IsEmail, IsEnum, MinLength, IsDateString } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEnum(Department)
  department: Department  ;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsDateString()
  joining_date: string;

  @IsEnum(Role)
  role: Role;
}
