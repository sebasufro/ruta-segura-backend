import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service.js';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

describe('AuthService - Validación de Atributos', () => {
  let service: AuthService;
  let repository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  } as unknown as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const validDto: CreateUserDto = {
    rut: '12.345.678-9',
    email: 'f.robles03@ufro.cl',
    password: 'password123',
    full_name: 'Fernando Robles',
    phone_number: '+56912345678',
    role: 'VOLUNTEER',
    address: 'Avenida Alemania 123, Temuco',
    emergency_contact: {
      contact_name: 'Contacto Emergencia',
      contact_number: '+56987654321',
    },
  };

  describe('Validación de Atributos Individuales', () => {
    
    it('should fail if RUT format is incorrect', async () => {
      const invalidDto = { ...validDto, rut: '123456789' }; // Sin guion
      mockUserRepository.findOne.mockResolvedValue(null);
      
      // La lógica del servicio debe rechazar formatos de RUT corruptos
      await expect(service.register(invalidDto)).rejects.toThrow();
    });

    it('should fail if email format is incorrect', async () => {
      const invalidDto = { ...validDto, email: 'fernando.ufro.cl' }; // Sin @
      await expect(service.register(invalidDto)).rejects.toThrow();
    });

    it('should fail if password is too short', async () => {
      const invalidDto = { ...validDto, password: '123' }; // Menor a 6 caracteres
      await expect(service.register(invalidDto)).rejects.toThrow();
    });

    it('should fail if full_name is empty', async () => {
      const invalidDto = { ...validDto, full_name: '' };
      await expect(service.register(invalidDto)).rejects.toThrow();
    });

    it('should fail if phone_number is invalid', async () => {
      const invalidDto = { ...validDto, phone_number: 'abcde123' }; // No numérico
      await expect(service.register(invalidDto)).rejects.toThrow();
    });

    it('should fail if role is not allowed', async () => {
      const invalidDto = { ...validDto, role: 'ESTUDIANTE' }; // Rol no definido en el Enum
      await expect(service.register(invalidDto)).rejects.toThrow();
    });

    it('should fail if emergency contact name is missing', async () => {
      const invalidDto = {
        ...validDto,
        emergency_contact: { contact_name: '', contact_number: '+56987654321' },
      };
      await expect(service.register(invalidDto)).rejects.toThrow();
    });

    it('should fail if emergency contact number is malformed', async () => {
      const invalidDto = {
        ...validDto,
        emergency_contact: { contact_name: 'Contacto', contact_number: '123' },
      };
      await expect(service.register(invalidDto)).rejects.toThrow();
    });
  });
});