import { Module } from '@nestjs/common';
import { RouteController } from './routes.controller';
import { RouteService } from './routes.service';

@Module({
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}