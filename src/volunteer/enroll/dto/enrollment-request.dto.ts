import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class EnrollmentRequestDto {
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
    enrollment_date: string,
    activity_type: string,
    confirmation_status: string,
  ) {
    this.enrollment_date = enrollment_date;
    this.activity_type = activity_type;
    this.confirmation_status = confirmation_status;
  }
}
