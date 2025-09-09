import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'changeme',
        signOptions: { expiresIn: cs.get<string>('JWT_EXPIRES_IN') || process.env.JWT_EXPIRES_IN || '3600s' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard, Reflector],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
