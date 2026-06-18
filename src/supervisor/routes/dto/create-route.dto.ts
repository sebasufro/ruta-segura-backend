import { IsString, IsNotEmpty, IsNumber, IsOptional, IsISO8601, IsInt, Min } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  route_name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsISO8601()
  @IsNotEmpty()
  starting_datetime!: string;

  @IsNumber()
  @IsNotEmpty()
  starting_latitude!: number;

  @IsNumber()
  @IsNotEmpty()
  starting_longitude!: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  max_capacity!: number;
}