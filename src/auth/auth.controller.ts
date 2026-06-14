import { Controller, Post, Body, Patch, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  @HttpCode(HttpStatus.CREATED)
  async signIn(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('v1/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto);
  }

  @Patch('v1/:id/profile/edit')
  @HttpCode(HttpStatus.OK)
  async editProfile(@Param('id') id: string, @Body() updateDto: UpdateProfileDto) {
    return this.authService.updateProfile(id, updateDto);
  }
}