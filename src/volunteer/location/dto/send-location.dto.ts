import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class SendLocationDto {
  @IsUUID()
  id_route: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
