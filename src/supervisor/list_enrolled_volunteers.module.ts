import { Module } from '@nestjs/common';
import { ListEnrolledVolunteersController } from './list_enrolled_volunteers.controller';
import { ListEnrolledVolunteersService } from './list_enrolled_volunteers.service';

@Module({
  controllers: [ListEnrolledVolunteersController],
  providers: [ListEnrolledVolunteersService],
})
export class ListEnrolledVolunteersModule {}