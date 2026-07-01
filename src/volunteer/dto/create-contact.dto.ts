import { IsString } from 'class-validator';

export class CreateEmergencyContactDto {
  @IsString()
  contact_name: string;

  @IsString()
  contact_number: string;
}