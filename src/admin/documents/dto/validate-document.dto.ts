import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateDocumentDto {
  @IsString()
  @IsNotEmpty()
  document_status: string;

  @IsString()
  @IsNotEmpty()
  verification_notes: string;

  @IsString()
  @IsNotEmpty()
  approval_date: string;
}
