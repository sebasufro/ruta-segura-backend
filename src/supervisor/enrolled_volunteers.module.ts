import { Module } from '@nestjs/common';
import { EnrolledVolunteersController } from './enrolled_volunteers.controller';
import { EnrolledVolunteersService } from './enrolled_volunteers.service';

@Module({
  controllers: [EnrolledVolunteersController],
  providers: [EnrolledVolunteersService],
})
export class EnrolledVolunteersModule {}