// auth.module.ts
//import { Module } from '@nestjs/common';
//import { JwtModule } from '@nestjs/jwt';
//import { PassportModule } from '@nestjs/passport';
//import { JwtStrategy } from './jwt.strategy';
//import { ConfigModule, ConfigService } from '@nestjs/config';

////@Module({
  //imports: [
    //PassportModule.register({ defaultStrategy: 'jwt' }),
 //   JwtModule.registerAsync({
   //   imports: [ConfigModule],
     // useFactory: async (configService: ConfigService) => ({
 //       secret: configService.get<string>('JWT_SECRET'), // Ensure 'JWT_SECRET' matches your actual configuration key
   //     signOptions: { expiresIn: '1h' },
     // }),
      //inject: [ConfigService],
  //  }),
  //  ConfigModule, // Import ConfigModule
 // ],
 // providers: [JwtStrategy],
 // exports: [JwtStrategy, PassportModule],
//})
//export class AuthModule {}
