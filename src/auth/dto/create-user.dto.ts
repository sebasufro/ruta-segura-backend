import { IsString, IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  contact_name: string;

  @IsString()
  @IsNotEmpty()
  contact_number: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergency_contact: EmergencyContactDto;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  id_legal_person?: string;
}