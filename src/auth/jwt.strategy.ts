import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!, // must exist
    });
  }

  // payload contains { sub, email, role }
  async validate(payload: any) {
    // Attach a minimal user object to req.user
    const user = await this.prisma.user.findUnique({
      where: { s_id: payload.sub },
      select: {
        s_id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
      },
    });
    return user; // becomes request.user
  }
}
