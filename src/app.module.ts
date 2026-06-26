import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RouteModule } from './supervisor/routes/routes.module';
import { UsersModule } from './admin/users/users.module';
import { DocumentsModule } from './admin/documents/documents.module';
import { AuthModule } from './auth/auth.module';
import { VolunteerRoutesModule } from './volunteer/routes/volunteer-routes.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DocumentsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RouteModule,
    VolunteerRoutesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }