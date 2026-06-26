import { Module } from '@nestjs/common';
import { GetEmergencyNumberController } from './get_emergency_number.controller';
import { GetEmergencyNumberService } from './get_emergency_number.service';

@Module({
  controllers: [GetEmergencyNumberController],
  providers: [GetEmergencyNumberService],
})
export class GetEmergencyNumberModule {}