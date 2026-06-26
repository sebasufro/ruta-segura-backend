import { Module } from '@nestjs/common';
import { VolunteerRoutesController } from './volunteer-routes.controller';
import { VolunteerRoutesService } from './volunteer-routes.service';

@Module({
  controllers: [VolunteerRoutesController],
  providers: [VolunteerRoutesService],
})
export class VolunteerRoutesModule {}
