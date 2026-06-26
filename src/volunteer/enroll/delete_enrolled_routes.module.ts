import { Module } from '@nestjs/common';
import { DeleteEnrolledRoutesController } from './delete_enrolled_routes.controller';
import { DeleteEnrolledRoutesService } from './delete_enrolled_routes.service';

@Module({
  controllers: [DeleteEnrolledRoutesController],
  providers: [DeleteEnrolledRoutesService],
})
export class DeleteEnrolledRoutesModule {}