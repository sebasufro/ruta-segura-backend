import { Module } from '@nestjs/common';
import { GetEnrolledVolunteerDetailsController } from './get_enrolled_volunteer_details.controller';
import { GetEnrolledVolunteerDetailsService } from './get_enrolled_volunteer_details.service';

@Module({
  controllers: [GetEnrolledVolunteerDetailsController],
  providers: [GetEnrolledVolunteerDetailsService],
})
export class GetEnrolledVolunteerDetailsModule {}