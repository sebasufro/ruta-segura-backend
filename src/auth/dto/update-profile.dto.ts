import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateEmergencyContactDto {
  @IsOptional()
  @IsString()
  contact_name?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  direction?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmergencyContactDto)
  emergency_contact?: UpdateEmergencyContactDto;
}