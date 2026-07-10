import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  users: {
    findUnique: jest.fn(),
  },
  organization_documents: {
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('creates admin supervisor with local Pendiente account status while document is pending', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue({ role: 'ADMIN' });
      const organizationFindFirst = jest.fn().mockResolvedValue({
        id_organization: 'org-1',
        name: 'Organizacion Demo',
      });
      const organizationCreate = jest.fn();
      const userCreate = jest.fn().mockResolvedValue({
        id_user: 'sup-1',
      });
      const documentCreate = jest.fn().mockResolvedValue({
        id_document: 'doc-1',
      });
      mockPrismaService.$transaction.mockImplementation(async (callback) =>
        callback({
          organization: {
            findFirst: organizationFindFirst,
            create: organizationCreate,
          },
          users: {
            create: userCreate,
          },
          organization_documents: {
            create: documentCreate,
          },
        }),
      );

      const result = await service.createUser(
        '11111111-1111-1111-1111-111111111111',
        {
          correo_electronico: 'supervisor@test.com',
          password: 'Admin123',
          rol: 'SUPERVISOR',
          nombre_completo: 'Super Visor',
          rut: '15.260.320-7',
          telefono: '+56912345678',
          organizacion: 'Organizacion Demo',
        },
        {
          originalname: 'certificado.pdf',
          mimetype: 'application/pdf',
          buffer: Buffer.from('%PDF certificado demo'),
        },
      );

      expect(userCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: 'SUPERVISOR',
            account_status: 'Pendiente',
          }),
        }),
      );
      expect(documentCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            document_status: 'PENDING',
          }),
        }),
      );
      expect(result.id_document).toBe('doc-1');
    });
  });

  describe('getPendingVerifications', () => {
    it('returns pending supervisor documents without base64 content', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue({ role: 'ADMIN' });
      mockPrismaService.organization_documents.findMany.mockResolvedValue([
        {
          id_document: 'doc-1',
          file_name: 'certificado.pdf',
          document_status: 'PENDING',
          content_base64: 'should-not-leak',
          organization: {
            id_organization: 'org-1',
            name: 'Organizacion Demo',
            users: [
              {
                id_user: 'sup-1',
                full_name: 'Super Visor',
                email: 'supervisor@test.com',
                rut: '15260320-7',
                phone_number: '+56912345678',
                role: 'SUPERVISOR',
                account_status: 'PENDING',
              },
            ],
          },
        },
      ]);

      const result = await service.getPendingVerifications(
        '11111111-1111-1111-1111-111111111111',
      );

      expect(result.total_results).toBe(1);
      expect(result.verifications[0].supervisor.id_user).toBe('sup-1');
      expect(result.verifications[0].organization.name).toBe('Organizacion Demo');
      expect(result.verifications[0].documents[0]).toEqual({
        id_document: 'doc-1',
        file_name: 'certificado.pdf',
        document_status: 'PENDING',
      });
      expect(JSON.stringify(result)).not.toContain('should-not-leak');
    });

    it('ignores pending documents without associated supervisor', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue({ role: 'ADMIN' });
      mockPrismaService.organization_documents.findMany.mockResolvedValue([
        {
          id_document: 'doc-1',
          file_name: 'certificado.pdf',
          document_status: 'PENDING',
          organization: {
            id_organization: 'org-1',
            name: 'Organizacion Demo',
            users: [],
          },
        },
      ]);

      const result = await service.getPendingVerifications(
        '11111111-1111-1111-1111-111111111111',
      );

      expect(result.total_results).toBe(0);
      expect(result.verifications).toEqual([]);
    });
  });
});
