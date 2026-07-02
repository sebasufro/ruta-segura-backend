import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  users: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  organization: {
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería retornar un token cuando las credenciales son válidas', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrismaService.users.findUnique.mockResolvedValue({
        id_user: 'uuid-123',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'VOLUNTEER',
      });

      const result = await service.login({ email: 'test@test.com', password: 'password123' });

      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result).toHaveProperty('rol', 'VOLUNTEER');
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'noexiste@test.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrismaService.users.findUnique.mockResolvedValue({
        id_user: 'uuid-123',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'VOLUNTEER',
      });

      await expect(
        service.login({ email: 'test@test.com', password: 'incorrecta' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('debería registrar un usuario exitosamente', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);
      mockPrismaService.users.create.mockResolvedValue({
        id_user: 'uuid-456',
        email: 'nuevo@test.com',
        role: 'VOLUNTEER',
      });

      const result = await service.signIn({
        email: 'nuevo@test.com',
        password: 'password123',
        rut: '12345678-9',
        role: 'VOLUNTEER',
        full_name: 'Nuevo Usuario',
      });

      expect(result.status).toBe('success');
      expect(result.message).toBe('Usuario registrado exitosamente');
    });

    it('debería lanzar ConflictException si el usuario ya existe', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue({
        id_user: 'uuid-123',
        email: 'existente@test.com',
        rut: '12345678-9',
      });

      await expect(
        service.signIn({
          email: 'existente@test.com',
          password: 'password123',
          rut: '12345678-9',
          role: 'VOLUNTEER',
          full_name: 'Usuario Existente',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
