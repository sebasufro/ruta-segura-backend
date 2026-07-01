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
import { EnrollRoutesModule } from './volunteer/enroll/enroll_routes.module';
import { EnrolledVolunteersModule } from './supervisor/enrolled_volunteers.module';
import { EmergencyNumberModule } from './volunteer/emergency_number.module';
import { AddressModule } from './profile/address/address.module';
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
    EnrollRoutesModule,
    EnrolledVolunteersModule,
    EmergencyNumberModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }