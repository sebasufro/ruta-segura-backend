import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DeleteEnrolledRoutesService } from './volunteer/enroll/delete_enrolled_routes.service';
import { EnrollNewRoutesController } from './volunteer/enroll/enroll_new_routes.controller';
import { EnrollNewRoutesService } from './volunteer/enroll/enroll_new_routes.service';
import { DeleteEnrolledRoutesController } from './volunteer/enroll/delete_enrolled_routes.controller';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [AppController, DeleteEnrolledRoutesController, EnrollNewRoutesController],
  providers: [AppService, DeleteEnrolledRoutesService, EnrollNewRoutesService],
})
export class AppModule {}
