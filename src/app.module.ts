// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin';
import { Doctor } from './entities/doctor';
import { Patient } from './entities/patient';
import { AdminController } from './controllers/admin.controller';
import { DoctorController } from './controllers/doctor.controller';
import { PatientController } from './controllers/patient.controller';
import { AdminService } from './services/admin.service';
import { DoctorService } from './services/doctor.service';
import { PatientService } from './services/patient.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module'; 
import { MyConfigModule } from './config/config.module';
// Import your authentication module

@Module({
  imports: [
    MyConfigModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ikramikram',
      database: 'DKA',
      entities: [Admin, Doctor, Patient],
      synchronize: true, // Only use this option in development mode
    }),
    TypeOrmModule.forFeature([Admin, Doctor, Patient]),
    AuthModule, // Include your AuthModule
  ],
  controllers: [AdminController, DoctorController, PatientController],
  providers: [AdminService, DoctorService, PatientService],
})
export class AppModule {}
