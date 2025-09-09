import { IsOptional, IsDateString } from 'class-validator';

export class GetAttendanceQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
