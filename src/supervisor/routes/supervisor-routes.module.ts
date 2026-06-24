import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupervisorRoutesController } from './supervisor-routes.controller.js';
import { SupervisorRoutesService } from './supervisor-routes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [SupervisorRoutesController],
  providers: [SupervisorRoutesService],
  exports: [SupervisorRoutesService],
})
export class SupervisorRoutesModule {}