import { IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceRecordDto } from './attendance-record.dto';

export class MarkAttendanceDto {
  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records: AttendanceRecordDto[];
}
