import { IsString, IsOptional, IsNumber, IsDateString, IsArray } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  route_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  starting_datetime?: string;

  @IsOptional()
  @IsDateString()
  ending_datetime?: string;

  @IsOptional()
  @IsNumber()
  min_volunteers?: number;

  @IsOptional()
  @IsNumber()
  max_capacity?: number;

  @IsOptional()
  @IsNumber()
  starting_latitude?: number;

  @IsOptional()
  @IsNumber()
  starting_longitude?: number;

  @IsOptional()
  @IsNumber()
  ending_latitude?: number;

  @IsOptional()
  @IsNumber()
  ending_longitude?: number;

  @IsOptional()
  @IsString()
  transport_type?: string;

  @IsOptional()
  @IsNumber()
  distance_meters?: number;

  @IsOptional()
  @IsArray()
  base_points?: any;

  @IsOptional()
  @IsArray()
  street_geometry?: any;

  @IsOptional()
  @IsString()
  status?: string;
}
