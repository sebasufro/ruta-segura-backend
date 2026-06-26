import { Module } from '@nestjs/common';
import { EnrollNewRoutesController } from './enroll_new_routes.controller';
import { EnrollNewRoutesService } from './enroll_new_routes.service';

@Module({
  controllers: [EnrollNewRoutesController],
  providers: [EnrollNewRoutesService],
})
export class EnrollNewRoutesModule {}