import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../Entities/doctor';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}
  async signIn(email: string, password: string): Promise<Doctor | null> {
    const doctor = await this.doctorRepository.findOne({
      where: { email },
    });
    if (doctor && await doctor.comparePassword(password)) {
      return doctor;
    }
    return null;
  }

  async registerDoctor(email: string, password: string, first_name: string, last_name: string,speciality: string ,phone: string, role: string, adress: string): Promise<Doctor> {
    const duplicate = await this.doctorRepository.findOne({ where: { email } });
    if (duplicate) {
      throw new HttpException(`This email ${email} is already used.`, HttpStatus.BAD_REQUEST);
    }
    
    const doctor: Doctor = this.doctorRepository.create({ email, password, first_name, last_name, phone, role , speciality , adress });
    return await this.doctorRepository.save(doctor);
  }
  

  async getDoctorByEmail(email: string): Promise<Doctor | undefined> {
    try {
      return await this.doctorRepository.findOne({ where: { email } });
    } catch (err) {
      console.log(err);
      return undefined; 
    }
  }

  async checkDoctor(email: string): Promise<Doctor | undefined> {
    try {
      return await this.doctorRepository.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async generateAccessToken(tokenData: any, JWTSecret_Key: string, JWT_EXPIRE: string): Promise<string> {
    try {
      return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    } catch (error) {
      throw error;
    }
  }

  async comparePassword(email: string, password: string): Promise<boolean> {
    // Retrieve the admin entity from the database based on the provided email

    const doctor= await this.doctorRepository.findOne({ where: { email } });
    
    // If admin doesn't exist or password doesn't match, return false
    if (!doctor || doctor.password !== password) {
      return false;
    }

    // Password matches
    return true;
  }
}