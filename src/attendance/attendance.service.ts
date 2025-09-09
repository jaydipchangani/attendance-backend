import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private normalizeDateToUTCStart(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async markAttendance(dto: MarkAttendanceDto) {
    if (!dto.records || dto.records.length === 0) {
      throw new BadRequestException('No attendance records provided');
    }

    const normalizedDate = this.normalizeDateToUTCStart(dto.date);

    const distinctIds = Array.from(new Set(dto.records.map(r => r.studentId)));
    const users = await this.prisma.user.findMany({
      where: { s_id: { in: distinctIds } },
      select: { s_id: true },
    });

    if (users.length !== distinctIds.length) {
      const existing = users.map(u => u.s_id);
      const missing = distinctIds.filter(id => !existing.includes(id));
      throw new BadRequestException(`Invalid studentIds: ${missing.join(', ')}`);
    }

    const ops = dto.records.map(rec =>
  this.prisma.attendance.upsert({
    where: { student_date_unique: { studentId: rec.studentId, date: normalizedDate } },
    update: { status: rec.status },
    create: {
      studentId: rec.studentId,
      date: normalizedDate,
      status: rec.status,
    },
  }),
);


    return this.prisma.$transaction(ops);
  }

  async getAttendanceByStudent(s_id: string, from?: string, to?: string) {
    const where: any = { studentId: s_id };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = this.normalizeDateToUTCStart(from);
      if (to) {
        const toDate = this.normalizeDateToUTCStart(to);
        toDate.setUTCHours(23, 59, 59, 999);
        where.date.lte = toDate;
      }
    }

    return this.prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        studentId: true,
        date: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async getAllAttendance(from?: string, to?: string) {
  const where: any = {};

  if (from || to) {
    where.date = {};
    if (from) where.date.gte = this.normalizeDateToUTCStart(from);
    if (to) {
      const toDate = this.normalizeDateToUTCStart(to);
      toDate.setUTCHours(23, 59, 59, 999);
      where.date.lte = toDate;
    }
  }

  // Group by studentId and count PRESENT days
  const grouped = await this.prisma.attendance.groupBy({
    by: ['studentId'],
    where: {
      ...where,
      status: 'PRESENT',
    },
    _count: {
      status: true,
    },
  });

  // Fetch student details for those studentIds
  const studentIds = grouped.map(g => g.studentId);
  const students = await this.prisma.user.findMany({
    where: { s_id: { in: studentIds } },
    select: {
      s_id: true,
      first_name: true,
      last_name: true,
      email: true,
      department: true,
      role: true,
    },
  });

  // Merge counts with student details
  return grouped.map(g => {
    const student = students.find(s => s.s_id === g.studentId);
    return {
      student,
      totalPresentDays: g._count.status,
    };
  });
}


}
