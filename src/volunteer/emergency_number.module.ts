import { Module } from '@nestjs/common';
import { EmergencyNumberController } from './emergency_number.controller';
import { EmergencyNumberService } from './emergency_number.service';

@Module({
  controllers: [EmergencyNumberController],
  providers: [EmergencyNumberService],
})
export class EmergencyNumberModule {}