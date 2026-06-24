import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupervisorRoutesController } from './supervisor-routes.controller.js';
import { SupervisorRoutesService } from './supervisor-routes.service.js';
import { Route } from '../../volunteer/routes/entities/route.entity.js';
import { User } from '../../auth/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Route, User])],
  controllers: [SupervisorRoutesController],
  providers: [SupervisorRoutesService],
  exports: [SupervisorRoutesService],
})
export class SupervisorRoutesModule {}