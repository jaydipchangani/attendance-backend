import { IsString, IsEmail, MinLength, IsDateString, IsEnum } from 'class-validator';
import { Role } from '../../common/enum/role.enum';
import { Department } from '@prisma/client';

export class RegisterDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEnum(Department)
  department: Department;

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
