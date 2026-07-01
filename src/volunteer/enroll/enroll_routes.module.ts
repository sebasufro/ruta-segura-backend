import { Module } from '@nestjs/common';
import { EnrollRoutesController } from './enroll_routes.controller';
import { EnrollRoutesService } from './enroll_routes.service';

@Module({
  controllers: [EnrollRoutesController],
  providers: [EnrollRoutesService],
})
export class EnrollRoutesModule {}