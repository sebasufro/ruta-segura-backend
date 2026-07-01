import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  alias: string;

  @IsString()
  full_address: string;
}