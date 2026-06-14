import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt'; 
// import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  // constructor(
  //   @InjectRepository(User) private userRepository: Repository<User>,
  //   private jwtService: JwtService
  // ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
      
      // Lógica de persistencia en MySQL aquí
      
      return {
        status: "success",
        message: "Usuario registrado exitosamente",
        data: {
          email: createUserDto.email,
          rol: createUserDto.role,
        }
      };
    } catch (error) {
      throw new InternalServerErrorException("Error interno del servidor.");
    }
  }

  async authenticate(loginDto: LoginDto) {
    // Lógica de búsqueda de usuario por email
    // const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    
    // const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    // if (!isPasswordValid) throw new UnauthorizedException("correo o contraseña incorrectos.");

    // const payload = { email: user.email, sub: user.id_user, role: user.role };
    // return {
    //   token: await this.jwtService.signAsync(payload),
    //   rol: user.role,
    // };
    
    return { message: "Autenticación estructurada" };
  }

  async updateProfile(id: string, updateDto: UpdateProfileDto) {
    // Lógica de actualización de perfil en la base de datos
    return {
      message: "Perfil actualizado correctamente",
      id_user: id
    };
  }
}