import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteerRoutesController } from './volunteer-routes.controller.js';
import { VolunteerRoutesService } from './volunteer-routes.service.js';
import { Route } from '../../../auth/entities/route.entity.js';
import { RouteEnrollment } from '../enroll/entities/route-enrollment.entity.js';
import { User } from '../../../auth/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Route, RouteEnrollment, User])],
  controllers: [VolunteerRoutesController],
  providers: [VolunteerRoutesService],
  exports: [VolunteerRoutesService],
})
export class VolunteerRoutesModule {}