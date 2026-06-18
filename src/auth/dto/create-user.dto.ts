import { IsEmail, IsString, IsNotEmpty, Length, Matches, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmergencyContactDto } from './emergency-contact.dto.js';
import { Role } from 'src/shared/enums/roles.enum.js';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El RUT es obligatorio' })
  // Expresión regular corregida: soporta opcionalmente puntos, exige guion y admite dígito verificador 0-9 o K/k
  @Matches(/^(\d{1,2}(\.\d{3}){2}-[\dkK]|\d{7,8}-[\dkK])$/, {
    message: 'El formato del RUT no es válido (ejemplos válidos: 12.345.678-9 o 12345678-9)',
  })
  rut!: string;

  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  full_name!: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'El número de teléfono debe ser un formato válido' })
  phone_number!: string;

  @IsString()
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsEnum(Role)
role!: Role;
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address!: string;

  @IsNotEmpty({ message: 'El objeto de contacto de emergencia es requerido' })
  @ValidateNested() // Activa la validación interna del objeto secundario
  @Type(() => EmergencyContactDto) // Mapea el JSON interno a la clase del DTO secundario
  emergency_contact!: EmergencyContactDto;
}