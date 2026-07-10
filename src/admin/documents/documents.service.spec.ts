import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
  users: {
    findUnique: jest.fn(),
  },
  organization_documents: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('DocumentsService', () => {
  let service: DocumentsService;
  const adminId = '11111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    jest.clearAllMocks();
  });

  function mockDocument() {
    mockPrismaService.users.findUnique.mockResolvedValue({ role: 'ADMIN' });
    mockPrismaService.organization_documents.findUnique.mockResolvedValue({
      id_document: 'doc-1',
      id_organization: 'org-1',
      file_name: 'certificado.pdf',
      organization: {
        users: [{ id_user: 'sup-1' }],
      },
    });
  }

  it('approves document and activates associated supervisor', async () => {
    mockDocument();
    const updateDocument = jest.fn().mockResolvedValue({
      id_document: 'doc-1',
      document_status: 'APPROVED',
    });
    const updateSupervisors = jest.fn().mockResolvedValue({ count: 1 });
    mockPrismaService.$transaction.mockImplementation(async (callback) =>
      callback({
        organization_documents: { update: updateDocument },
        users: { updateMany: updateSupervisors },
      }),
    );

    const result = await service.validateDocument(adminId, 'doc-1', {
      document_status: 'APPROVED',
      verification_notes: 'Documento correcto',
      approval_date: '2026-07-10T00:00:00.000Z',
    });

    expect(updateDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ document_status: 'APPROVED' }),
      }),
    );
    expect(updateSupervisors).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id_organization: 'org-1', role: 'SUPERVISOR' },
        data: { account_status: 'ACTIVE' },
      }),
    );
    expect(result.supervisor_status).toBe('ACTIVE');
    expect(result.supervisors_updated).toBe(1);
  });

  it('rejects document and blocks associated supervisor', async () => {
    mockDocument();
    const updateDocument = jest.fn().mockResolvedValue({
      id_document: 'doc-1',
      document_status: 'REJECTED',
    });
    const updateSupervisors = jest.fn().mockResolvedValue({ count: 1 });
    mockPrismaService.$transaction.mockImplementation(async (callback) =>
      callback({
        organization_documents: { update: updateDocument },
        users: { updateMany: updateSupervisors },
      }),
    );

    const result = await service.validateDocument(adminId, 'doc-1', {
      document_status: 'REJECTED',
      verification_notes: 'Documento ilegible',
      approval_date: '2026-07-10T00:00:00.000Z',
    });

    expect(updateSupervisors).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { account_status: 'BLOCKED' },
      }),
    );
    expect(result.supervisor_status).toBe('BLOCKED');
  });

  it('requires notes when rejecting a document', async () => {
    mockPrismaService.users.findUnique.mockResolvedValue({ role: 'ADMIN' });

    await expect(
      service.validateDocument(adminId, 'doc-1', {
        document_status: 'REJECTED',
        verification_notes: '   ',
        approval_date: '2026-07-10T00:00:00.000Z',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
