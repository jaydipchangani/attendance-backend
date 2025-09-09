import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from '../auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':s_id')
  findOne(@Param('s_id') s_id: string) {
    return this.usersService.findOne(s_id);
  }

  @Patch(':s_id')
  @Roles(Role.ADMIN)
  update(@Param('s_id') s_id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(s_id, updateUserDto);
  }

  @Delete(':s_id')
  @Roles(Role.ADMIN)
  remove(@Param('s_id') s_id: string) {
    return this.usersService.remove(s_id);
  }

  @Get('all-users-names')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllStudents() {
    return this.usersService.getAllStudents();
  }
}
