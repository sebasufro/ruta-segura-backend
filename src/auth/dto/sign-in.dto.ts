import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

class EmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  contact_name: string;

  @IsString()
  @IsNotEmpty()
  contact_number: string;
}

class CertificateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class SignInDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  role: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  full_name: string;

  @IsString()
  @IsNotEmpty({ message: 'El RUT es obligatorio' })
  rut: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergency_contact?: EmergencyContactDto;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  id_legal_person?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CertificateDto)
  certificate?: CertificateDto;
}
