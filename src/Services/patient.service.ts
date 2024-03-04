import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Patient } from '../Entities/patient';

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
    try {
      const patient = await this.patientRepository.findOne({ where: { email } });

      if (!patient || !(await patient.comparePassword(password))) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error during password comparison:', error);
      throw new HttpException('Error during password comparison.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateToken(token: string, JWTSecret_Key: string): Promise<boolean> {
    try {
      // Verify the token using the provided secret key
      jwt.verify(token, JWTSecret_Key);
      return true;
    } catch (error) {
      // Token is invalid
      return false;
    }
  }

  extractPatientIdFromToken(token: string): string {
    try {
      // Decode the token to get the payload
      const decodedToken: any = jwt.decode(token);
      console.log('Decoded Token:', decodedToken);

      // Extract and return the user ID from the payload
      return decodedToken._id;
    } catch (error) {
      throw new HttpException('Error extracting user ID from token.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}