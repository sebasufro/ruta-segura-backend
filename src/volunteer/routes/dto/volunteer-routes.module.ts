import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteerRoutesController } from './volunteer-routes.controller.js';
import { VolunteerRoutesService } from './volunteer-routes.service.js';
import { Route } from '../../../auth/entities/route.entity.js';

@Module({
  imports: [
    // Otorga acceso al repositorio físico de la tabla route
    TypeOrmModule.forFeature([Route]),
  ],
  controllers: [VolunteerRoutesController],
  providers: [VolunteerRoutesService],
  exports: [VolunteerRoutesService],
})
export class VolunteerRoutesModule {}