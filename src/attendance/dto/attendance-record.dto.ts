import { IsString, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class AttendanceRecordDto {
  @IsString()
  studentId: string;

  @IsEnum(Status)
  status: Status;
}
