import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RouteModule } from './supervisor/routes/routes.module';
import { UsersModule } from './admin/users/users.module';
import { DocumentsModule } from './admin/documents/documents.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { VolunteerRoutesModule } from './volunteer/routes/volunteer-routes.module';
import { DeleteEnrolledRoutesModule } from './volunteer/enroll/delete_enrolled_routes.module';
import { EnrollNewRoutesModule } from './volunteer/enroll/enroll_new_routes.module';
import { ListEnrolledVolunteersModule } from './supervisor/list_enrolled_volunteers.module';
import { EmergencyNumberModule } from './volunteer/emergency_number.module';
import { AddressModule } from './profile/address/address.module';
import { DeleteEnrolledVolunteerModule } from './supervisor/delete_enrolled_volunteer.module';
import { GetEnrolledVolunteerDetailsModule } from './supervisor/get_enrolled_volunteer_details.module';
import { LocationModule } from './volunteer/location/location.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DocumentsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RouteModule,
    VolunteerRoutesModule,
    LocationModule,
    ProfileModule,
    EnrollNewRoutesModule,
    DeleteEnrolledRoutesModule,
    ListEnrolledVolunteersModule,
    EmergencyNumberModule,
    AddressModule,
    DeleteEnrolledVolunteerModule,
    GetEnrolledVolunteerDetailsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }