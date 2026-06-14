import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  // imports: [
  //   JwtModule.register({
  //     global: true,
  //     secret: 'TU_SECRETO_AQUI',
  //     signOptions: { expiresIn: '8h' },
  //   }),
  // ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}