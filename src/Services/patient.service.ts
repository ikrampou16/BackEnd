import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../Entities/patient'
import * as bcrypt from 'bcryptjs';


@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async signIn(email: string, password: string): Promise<Patient | null> {
    const patient = await this.patientRepository.findOne({
      where: { email },
    });
    if (patient && await patient.comparePassword(password)) {
      return patient;
    }
    return null;
  }

  async registerPatient(email: string, password: string, first_name: string, last_name: string, phone: string, role: string ,  address:string ,  age:number , gender:string , height:number ,weight: number): Promise<Patient> {
    const duplicate = await this.patientRepository.findOne({ where: { email } });
    if (duplicate) {
      throw new HttpException(`This email ${email} is already used.`, HttpStatus.BAD_REQUEST);
    }
    
    const patient: Patient = this.patientRepository.create({ email, password, first_name, last_name, phone, role , address , age , gender , height , weight});
    return await this.patientRepository.save(patient);
  }
  

  async getPatientByEmail(email: string): Promise<Patient| undefined> {
    try {
      return await this.patientRepository.findOne({ where: { email } });
    } catch (err) {
      console.log(err);
      return undefined; 
    }
  }

  async checkPatient(email: string): Promise<Patient | undefined> {
    try {
      return await this.patientRepository.findOne({ where: { email } });
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

    const patient = await this.patientRepository.findOne({ where: { email } });
    
    // If admin doesn't exist or password doesn't match, return false
    if (!patient|| patient.password !== password) {
      return false;
    }

    // Password matches
    return true;
  }




}