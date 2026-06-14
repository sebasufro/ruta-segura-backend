import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'; // <-- AGREGA ESTA LÍNEA
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service.js';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;

  // Definimos funciones falsas (Mocks) para simular el comportamiento de TypeORM
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
          // Le indicamos a NestJS que cuando el servicio pida el repositorio de User, entregue nuestro Mock
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia el historial de ejecuciones entre cada test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register (signIn)', () => {
    const mockDto: CreateUserDto = {
      email: 'test@ufro.cl',
      password: 'password123',
      role: 'VOLUNTEER',
      full_name: 'Fernando Robles',
      rut: '12.345.678-9',
      phone_number: '+56912345678',
      address: 'Temuco, Avenida Alemania 123',
      emergency_contact: {
        contact_name: 'Contacto Emergencia',
        contact_number: '+56987654321',
      },
    };

    it('should register a user successfully if email does not exist', async () => {
      // Configuramos el mock para que simule que NO encontró un usuario duplicado
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockDto);
      mockUserRepository.save.mockResolvedValue({ id_user: 'uuid-generado-123', ...mockDto });

      const result = await service.register(mockDto);

      expect(result).toHaveProperty('status', 'success');
      expect(result.data).toHaveProperty('id_user', 'uuid-generado-123');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw a ConflictException if email already exists', async () => {
      // Configuramos el mock para que simule que SÍ encontró un usuario con ese correo
      mockUserRepository.findOne.mockResolvedValue({ id_user: 'uuid-existente' });

      await expect(service.register(mockDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});