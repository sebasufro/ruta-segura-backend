import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      // 1. Validar si el correo ya existe (Evita duplicados antes de insertar)
      const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
      if (existingUser) {
        throw new ConflictException('El correo electrónico ya se encuentra registrado en el sistema');
      }

      // 2. Hashear la contraseña de forma segura
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      // 3. Crear la estructura relacional completa mapeando el DTO a las entidades
      const newUser = this.userRepository.create({
        rut: createUserDto.rut,
        email: createUserDto.email,
        password: hashedPassword,
        full_name: createUserDto.full_name,
        phone_number: createUserDto.phone_number,
        role: createUserDto.role,
        account_status: createUserDto.role === 'SUPERVISOR' ? 'pendiente' : 'activo',
        // Mapeo automático a la tabla 'emergency_contacts' vía cascada
        emergency_contacts: [
          {
            contact_name: createUserDto.emergency_contact.contact_name,
            contact_number: createUserDto.emergency_contact.contact_number,
          }
        ],
        // Mapeo automático a la tabla 'user_addresses' vía cascada
        addresses: [
          {
            alias: 'Principal',
            full_address: createUserDto.address,
          }
        ]
      });

      // 4. Persistir en PostgreSQL de manera atómica
      const savedUser = await this.userRepository.save(newUser);

      // 5. Retornar la respuesta estructurada tal como lo exige el contrato de la API
      return {
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: {
          id_user: savedUser.id_user,
          email: savedUser.email,
          rol: savedUser.role,
          created_in: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error interno del servidor al procesar el registro.');
    }
  }

  async authenticate(loginDto: LoginDto) {
    return { message: 'Autenticación estructurada' };
  }

  async updateProfile(id: string, updateDto: UpdateProfileDto) {
    return { message: 'Perfil actualizado correctamente', id_user: id };
  }
}