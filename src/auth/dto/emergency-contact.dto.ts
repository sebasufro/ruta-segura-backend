import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class EmergencyContactDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del contacto de emergencia es obligatorio' })
  contact_name!: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de contacto es obligatorio' })
  // Valida el formato de teléfono chileno o internacional (ej: +56912345678)
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'El número de contacto debe ser un formato telefónico válido' })
  contact_number!: string;
}