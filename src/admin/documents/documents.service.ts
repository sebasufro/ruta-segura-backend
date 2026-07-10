import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ValidateDocumentDto } from './dto/validate-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDocument(idAdmin: string, idDocument: string) {
    await this.validateAdmin(
      idAdmin,
      'No autorizado. Se requiere validación de cuenta de administrador.',
    );

    try {
      const document = await this.prisma.organization_documents.findUnique({
        where: { id_document: idDocument },
      });

      if (!document) {
        throw new NotFoundException({
          error: 'Documento no encontrado. Es posible que haya sido eliminado tras la verificación.',
        });
      }

      return {
        status: 'exitoso',
        document_data: {
          file_name: document.file_name,
          file_type: document.file_name.split('.').pop()?.toUpperCase() ?? 'UNKNOWN',
          upload_date: document.approval_date
            ? document.approval_date.toISOString().split('T')[0]
            : null,
          content_base64: document.content_base64,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        error: 'Error interno del servidor al intentar recuperar el archivo.',
      });
    }
  }

  async deleteDocument(idAdmin: string, idDocument: string) {
    await this.validateAdmin(idAdmin, 'No autorizado.');

    const document = await this.prisma.organization_documents.findUnique({
      where: { id_document: idDocument },
    });

    if (!document) {
      throw new NotFoundException({ error: 'Documento no encontrado.' });
    }

    try {
      await this.prisma.organization_documents.delete({
        where: { id_document: idDocument },
      });

      return {
        message:
          'Documento eliminado correctamente de acuerdo a las políticas de protección de datos.',
      };
    } catch (error) {
      throw new InternalServerErrorException({ error: 'Error interno del servidor.' });
    }
  }

  async validateDocument(
    idAdmin: string,
    idDocument: string,
    validateDocumentDto: ValidateDocumentDto,
  ) {
    await this.validateAdmin(idAdmin, 'No autorizado. Acceso restringido a administradores.');

    const documentStatus = validateDocumentDto.document_status.trim().toUpperCase();
    if (!['APPROVED', 'REJECTED'].includes(documentStatus)) {
      throw new BadRequestException({
        error: 'El estado del documento debe ser APPROVED o REJECTED.',
      });
    }

    const verificationNotes = validateDocumentDto.verification_notes.trim();
    if (documentStatus === 'REJECTED' && verificationNotes.length === 0) {
      throw new BadRequestException({
        error: 'Las notas de verificación son obligatorias para rechazar un documento.',
      });
    }

    const approvalDate = this.parseApprovalDate(validateDocumentDto.approval_date);
    const document = await this.prisma.organization_documents.findUnique({
      where: { id_document: idDocument },
      include: {
        organization: {
          include: {
            users: {
              where: { role: 'SUPERVISOR' },
              select: { id_user: true },
            },
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException({ error: 'Documento no encontrado.' });
    }

    if (document.organization.users.length === 0) {
      throw new BadRequestException({
        error: 'No existe un supervisor asociado a la organización del documento.',
      });
    }

    const supervisorStatus = documentStatus === 'APPROVED' ? 'ACTIVE' : 'BLOCKED';

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const updatedDocument = await tx.organization_documents.update({
          where: { id_document: idDocument },
          data: {
            document_status: documentStatus,
            verification_notes: verificationNotes,
            approval_date: approvalDate,
          },
        });

        const updatedSupervisors = await tx.users.updateMany({
          where: {
            id_organization: document.id_organization,
            role: 'SUPERVISOR',
          },
          data: {
            account_status: supervisorStatus,
          },
        });

        return { updatedDocument, updatedSupervisors };
      });

      return {
        status: 'exitoso',
        message: 'Documento verificado correctamente',
        id_document: idDocument,
        document_status: result.updatedDocument.document_status,
        supervisor_status: supervisorStatus,
        supervisors_updated: result.updatedSupervisors.count,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        error: 'Error interno del servidor al procesar la validación del archivo.',
      });
    }
  }

  private async validateAdmin(idAdmin: string, message: string) {
    const admin = await this.prisma.users.findUnique({
      where: { id_user: idAdmin },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedException({ error: message });
    }
  }

  private parseApprovalDate(value: string) {
    const isoDate = new Date(value);
    if (!Number.isNaN(isoDate.getTime())) {
      return isoDate;
    }

    const match = value
      .trim()
      .toLowerCase()
      .match(/^(\d{1,2}) de ([a-záéíóúñ]+) (\d{4})$/);

    if (!match) {
      throw new BadRequestException({
        error: 'La fecha de aprobación debe ser una fecha válida.',
      });
    }

    const months: Record<string, number> = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
    };

    const month = months[match[2]];
    if (month === undefined) {
      throw new BadRequestException({
        error: 'La fecha de aprobación debe ser una fecha válida.',
      });
    }

    return new Date(Date.UTC(Number(match[3]), month, Number(match[1])));
  }
}
