import { IsString, IsEmail, IsOptional, IsEnum, MinLength, IsDateString } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsDateString()
  joining_date?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
