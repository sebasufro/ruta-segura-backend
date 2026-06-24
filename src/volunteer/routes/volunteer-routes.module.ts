import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteerRoutesController } from './volunteer-routes.controller.js';
import { VolunteerRoutesService } from './volunteer-routes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [VolunteerRoutesController],
  providers: [VolunteerRoutesService],
  exports: [VolunteerRoutesService],
})
export class VolunteerRoutesModule {}