import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserCertificateDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  contenido: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  correo_electronico: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  rol: string;

  @IsString()
  @IsNotEmpty()
  nombre_completo: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsString()
  @IsNotEmpty()
  organizacion: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserCertificateDto)
  certificado?: CreateUserCertificateDto;
}
