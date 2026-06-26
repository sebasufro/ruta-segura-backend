import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DeleteEnrolledRoutesController } from './volunteer/enroll/delete_enrolled_routes.controller';
import { DeleteEnrolledRoutesService } from './volunteer/enroll/delete_enrolled_routes.service';
import { EnrollNewRoutesController } from './volunteer/enroll/enroll_new_routes.controller';
import { EnrollNewRoutesService } from './volunteer/enroll/enroll_new_routes.service';
import { ListEnrolledVolunteersController } from './supervisor/list_enrolled_volunteers.controller';
import { ListEnrolledVolunteersService } from './supervisor/list_enrolled_volunteers.service';
import { GetEmergencyNumberController } from './volunteer/get_emergency_number.controller';
import { GetEmergencyNumberService } from './volunteer/get_emergency_number.service';
import { DeleteEnrolledVolunteerController } from './supervisor/delete_enrolled_volunteer.controller';
import { DeleteEnrolledVolunteerService } from './supervisor/delete_enrolled_volunteer.service';
import { GetEnrolledVolunteerDetailsController } from './supervisor/get_enrolled_volunteer_details.controller';
import { GetEnrolledVolunteerDetailsService } from './supervisor/get_enrolled_volunteer_details.service';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [AppController, DeleteEnrolledRoutesController, EnrollNewRoutesController, ListEnrolledVolunteersController, GetEmergencyNumberController, DeleteEnrolledVolunteerController, GetEnrolledVolunteerDetailsController],
  providers: [AppService, DeleteEnrolledRoutesService, EnrollNewRoutesService, ListEnrolledVolunteersService, GetEmergencyNumberService, DeleteEnrolledVolunteerService, GetEnrolledVolunteerDetailsService],
})
export class AppModule {}
