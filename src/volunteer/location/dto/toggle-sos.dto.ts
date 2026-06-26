import { IsBoolean, IsUUID } from 'class-validator';

export class ToggleSosDto {
  @IsUUID()
  id_route: string;

  @IsBoolean()
  sos_active: boolean;
}
