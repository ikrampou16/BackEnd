import { Controller, Post, Body, Res, HttpStatus, HttpException , Get } from '@nestjs/common';
import { PatientService } from '../Services/patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}


  @Post('register')
  async createPatient(@Body() body: any, @Res() res): Promise<any> {
    try {
      const { email, password, first_name, last_name, phone, role , address , age , gender , height , weight } = body;
      
      // Check if admin with the same email already exists
      const duplicate = await this.patientService.getPatientByEmail(email);
      if (duplicate) {
        throw new HttpException(`This email ${email} is already used.`, HttpStatus.BAD_REQUEST);
      }

      // Register the new admin
      const response = await this.patientService.registerPatient(email, password, first_name, last_name, phone, role , address , age , gender , height , weight);

      // Generate JWT token
      const tokenData = { _id: response.id_patient, email };
      const token = await this.patientService.generateAccessToken(tokenData, "secret", "1h");

      // Return response
      return res.status(HttpStatus.OK).json({ status: true, message: 'Patient account is successfully created.', token, id: response.id_patient });
    } catch (err) {
      console.error("---> err -->", err);
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new HttpException('Error when creating the patient account.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post('login')
  async loginPatient(@Body() body: any, @Res() res): Promise<any> {
    try {
      const { email, password } = body;

      if (!email || !password) {
        throw new HttpException('Parameters are incorrect.', HttpStatus.BAD_REQUEST);
      }

      let patient= await this.patientService.checkPatient(email);
      if (!patient) {
        throw new HttpException('This patient doesn\'t exist.', HttpStatus.NOT_FOUND);
      }
        
      //They were using admin and password.
      const ispasswordCorrect = await patient.comparePassword(password);

      if (!ispasswordCorrect) {
        throw new HttpException('Incorrect email .', HttpStatus.UNAUTHORIZED);
      }

      // Creating Token
      const tokenData = { _id: patient.id_patient, email: patient.email };
      const token = await this.patientService.generateAccessToken(tokenData, "secret", "1h");

      res.status(HttpStatus.OK).json({ status: true, success: "Connected!", token, data :patient});
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Error while logging in.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

}