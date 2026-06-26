import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class EnrollmentRequestDTO {
  @IsUUID()
  @IsNotEmpty()
  id_volunteer: string;

  @IsString()
  @IsNotEmpty()
  enrollment_date: string;

  @IsString()
  @IsNotEmpty()
  activity_type?: string;

  @IsString()
  @IsNotEmpty()
  confirmation_status: string;

  constructor(
    id_volunteer: string,
    enrollment_date: string,
    activity_type: string,
    confirmation_status: string,
  ) {
    this.id_volunteer = id_volunteer;
    this.enrollment_date = enrollment_date;
    this.activity_type = activity_type;
    this.confirmation_status = confirmation_status;
  }
}
