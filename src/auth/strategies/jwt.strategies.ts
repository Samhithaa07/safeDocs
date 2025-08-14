import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  // The payload type here depends on what you signed into the JWT in your login
  async validate(payload: { sub: number; email: string; role: string }) {
    // This object becomes req.user in your controllers
    return {
      sub: payload.sub,   // user ID
      email: payload.email,
      role: payload.role, // role string like 'admin' or 'user'
    };
  }
}