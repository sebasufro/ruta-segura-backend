import { PartialType } from '@nestjs/mapped-types';
import { CreateEmergencyContactDto } from './create-contact.dto';

export class UpdateEmergencyContactDto extends PartialType(CreateEmergencyContactDto) {}
