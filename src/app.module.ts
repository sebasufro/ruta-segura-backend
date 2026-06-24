import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { VolunteerRoutesModule } from './volunteer/routes/volunteer-routes.module';
import { SupervisorRoutesModule } from './supervisor/routes/supervisor-routes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'user_admin',
      password: 'password_123',
      database: 'rutasegura_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    VolunteerRoutesModule,
    SupervisorRoutesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}