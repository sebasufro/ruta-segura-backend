import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  @HttpCode(HttpStatus.CREATED)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post(['login', 'v1/login'])
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
