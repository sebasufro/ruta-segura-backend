import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

class EmergencyContactDto {
  @IsOptional()
  @IsString()
  nombre_contacto?: string;

  @IsOptional()
  @IsString()
  telefono_contacto?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  new_name?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  organizacion?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  contacto_emergencia?: EmergencyContactDto;
}
