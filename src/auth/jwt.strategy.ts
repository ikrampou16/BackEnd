// jwt.strategy.ts
//import { Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
//import { PassportStrategy } from '@nestjs/passport';
//import { ExtractJwt, Strategy } from 'passport-jwt';

//@Injectable()
//export class JwtStrategy extends PassportStrategy(Strategy) {
 // constructor(private readonly configService: ConfigService) {
 //   super({
  //    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //    secretOrKey: configService.get<string>('ikram'),
  //  });
  //}

 // async validate(payload: any) {
 //   // Validation logic here (if needed)
 //   return { userId: payload.sub, email: payload.email };
 // }
//}
