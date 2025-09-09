import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Prisma } from '@prisma/client';
import { Role } from '../common/enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Validate credentials, return user object without password or null
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _pw, ...safe } = user;
    return safe;
  }

  async login(user: any) {
    const payload = { sub: user.s_id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: process.env.JWT_EXPIRES_IN || '3600s',
    };
  }

  // Admin registers a student
  async register(dto: RegisterDto) {
    // check existing email
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email }});
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);

    const created = await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        department: dto.department,
        email: dto.email,
        password: hashed,
        joining_date: new Date(dto.joining_date),
        // cast to Prisma.Role to satisfy types
        role: dto.role 
      },
      select: {
        s_id: true,
        first_name: true,
        last_name: true,
        department: true,
        email: true,
        joining_date: true,
        role: true,
        createdAt: true,
      }
    });

    return created;
  }
}
