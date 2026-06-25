import { IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class FilterRouteDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  transport_type?: string;

  @IsOptional()
  @IsUUID()
  id_supervisor?: string;

  @IsOptional()
  @IsString()
  route_name?: string;

  @IsOptional()
  @IsDateString()
  starting_date_from?: string;

  @IsOptional()
  @IsDateString()
  starting_date_to?: string;
}