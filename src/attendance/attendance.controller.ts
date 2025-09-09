import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enum/role.enum';
import { GetAttendanceQueryDto } from './dto/get-attendance-query.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async mark(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(dto);
  }

  @Get('student/:s_id')
  @UseGuards(JwtAuthGuard)
  async getStudentAttendance(
    @Param('s_id') s_id: string, 
    @Query() query: GetAttendanceQueryDto,
    @Req() req: any,
  ) {
    const user = req.user;
    if (user.role !== Role.ADMIN && user.s_id !== s_id) {
      throw new ForbiddenException('You are not allowed to view this attendance');
    }

    return this.attendanceService.getAttendanceByStudent(s_id, query.from, query.to);
  }

   @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllAttendance(@Query() query: GetAttendanceQueryDto) {
    return this.attendanceService.getAllAttendance(query.from, query.to);
  }
}
