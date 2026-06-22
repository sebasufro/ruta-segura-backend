import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya se encuentra registrado en el sistema');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      rut: createUserDto.rut,
      email: createUserDto.email,
      password: hashedPassword,
      full_name: createUserDto.full_name,
      phone_number: createUserDto.phone_number,
      role: createUserDto.role,
      account_status: createUserDto.role === 'SUPERVISOR' ? 'pendiente' : 'activo',
      emergency_contacts: [
        {
          contact_name: createUserDto.emergency_contact.contact_name,
          contact_number: createUserDto.emergency_contact.contact_number,
        }
      ],
      addresses: [
        {
          alias: 'Principal',
          full_address: createUserDto.address,
        }
      ]
    });

    const savedUser = await this.userRepository.save(newUser);

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
  }

  async authenticate(loginDto: LoginDto) {
    // 1. Buscar usuario por email
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar contraseña
    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Verificar que la cuenta esté activa
    if (user.account_status !== 'activo') {
      throw new UnauthorizedException('Tu cuenta está pendiente de aprobación o ha sido desactivada');
    }

    // 4. Generar JWT con payload mínimo
    const payload = {
      sub: user.id_user,
      email: user.email,
      role: user.role,
      token_version: user.token_version,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      status: 'success',
      message: 'Autenticación exitosa',
      data: {
        access_token: token,
        id_user: user.id_user,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async updateProfile(id: string, updateDto: UpdateProfileDto) {
    // 1. Verificar que el usuario exista
    const user = await this.userRepository.findOne({
      where: { id_user: id },
      relations: { addresses: true, emergency_contacts: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 2. Actualizar campos simples si vienen en el DTO
    if (updateDto.phone_number) {
      user.phone_number = updateDto.phone_number;
    }

    if (updateDto.direction) {
      // Actualiza la primera dirección (la principal)
      if (user.addresses && user.addresses.length > 0) {
        user.addresses[0].full_address = updateDto.direction;
      }
    }

    if (updateDto.emergency_contact) {
      if (user.emergency_contacts && user.emergency_contacts.length > 0) {
        if (updateDto.emergency_contact.contact_name) {
          user.emergency_contacts[0].contact_name = updateDto.emergency_contact.contact_name;
        }
        if (updateDto.emergency_contact.phone_number) {
          user.emergency_contacts[0].contact_number = updateDto.emergency_contact.phone_number;
        }
      }
    }

    // 3. Persistir cambios (cascade guarda relaciones también)
    await this.userRepository.save(user);

    return {
      status: 'success',
      message: 'Perfil actualizado correctamente',
      data: {
        id_user: user.id_user,
        phone_number: user.phone_number,
      },
    };
  }
}
