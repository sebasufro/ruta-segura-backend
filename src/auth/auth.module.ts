import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { User } from './entities/user.entity.js';
import { UserAddress } from './entities/user-address.entity.js';
import { EmergencyContact } from './entities/emergency-contact.entity.js';

@Module({
  imports: [
    // Esto le da acceso al AuthService a los repositorios de estas tablas
    TypeOrmModule.forFeature([User, UserAddress, EmergencyContact]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}