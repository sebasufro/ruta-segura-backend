import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

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
 synchronize: true, // <-- CAMBIA A TRUE TEMPORALMENTE
}),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}