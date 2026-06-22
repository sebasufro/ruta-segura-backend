import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { User } from './entities/user.entity.js';
import { UserAddress } from './entities/user-address.entity.js';
import { EmergencyContact } from './entities/emergency-contact.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAddress, EmergencyContact]),
    JwtModule.register({
      global: true, // disponible en todo el proyecto sin reimportar
      secret: process.env.JWT_SECRET ?? 'ruta_segura_secret',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
