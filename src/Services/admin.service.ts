import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin';
import * as bcrypt from 'bcrypt';
import { AdminRepository } from '../repositories/admin.repository';
//Repositories act as an intermediary between your application code and the database (create, update, delete...)

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async signIn(email: string, password: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({
      where: { email },
    });
    if (admin && await admin.comparePassword(password)) {
      return admin;
    }
    return null;
  }

  async registerAdmin(email: string, password: string, first_name: string, last_name: string, phone: string, role: string): Promise<Admin> {
    const duplicate = await this.adminRepository.findOne({ where: { email } });
    if (duplicate) {
      throw new HttpException(`This email ${email} is already used.`, HttpStatus.BAD_REQUEST);
    }
    
    const admin: Admin = this.adminRepository.create({ email, password, first_name, last_name, phone, role });
    return await this.adminRepository.save(admin);
  }
  

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    try {
      return await this.adminRepository.findOne({ where: { email } });
    } catch (err) {
      console.log(err);
      return undefined; 
    }
  }

  async checkAdmin(email: string): Promise<Admin | undefined> {
    try {
      return await this.adminRepository.findOne({ where: { email } });
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

    const admin = await this.adminRepository.findOne({ where: { email } });
    
    // If admin doesn't exist or password doesn't match, return false
    if (!admin || admin.password !== password) {
      return false;
    }

    // Password matches
    return true;
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
}

