import { Module } from '@nestjs/common';
import { DeleteEnrolledVolunteerController } from './delete_enrolled_volunteer.controller';
import { DeleteEnrolledVolunteerService } from './delete_enrolled_volunteer.service';

@Module({
  controllers: [DeleteEnrolledVolunteerController],
  providers: [DeleteEnrolledVolunteerService],
})
export class DeleteEnrolledVolunteerModule {}