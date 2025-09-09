import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Department } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  const user = await this.prisma.user.create({
    data: {
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      department: createUserDto.department,
      email: createUserDto.email,
      password: hashedPassword,
      joining_date: new Date(createUserDto.joining_date),
      role: createUserDto.role,
    },
  });

  return user;
}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        s_id: true,
        first_name: true,
        last_name: true,
        department: true,
        email: true,
        joining_date: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOne(s_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { s_id },
      select: {
        s_id: true,
        first_name: true,
        last_name: true,
        department: true,
        email: true,
        joining_date: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(s_id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { s_id },
      data: {
        ...updateUserDto,
        joining_date: updateUserDto.joining_date
          ? new Date(updateUserDto.joining_date)
          : undefined,
      },
    });
  }

  async remove(s_id: string) {
    return this.prisma.user.delete({ where: { s_id } });
  }

  async findByEmail(email: string) {
  return this.prisma.user.findUnique({ where: { email }});
}
}

