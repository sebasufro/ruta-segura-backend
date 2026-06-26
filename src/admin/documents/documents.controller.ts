import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ValidateDocumentDto } from './dto/validate-document.dto';
import { DocumentsService } from './documents.service';

@Controller('api')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':id_admin/documents/:id_document')
  getDocument(
    @Param('id_admin') idAdmin: string,
    @Param('id_document') idDocument: string,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(
      authorization,
      'No autorizado. Se requiere validación de cuenta de administrador.',
    );
    return this.documentsService.getDocument(idAdmin, idDocument);
  }

  @Delete(':id_admin/documents/:id_document/delete')
  deleteDocument(
    @Param('id_admin') idAdmin: string,
    @Param('id_document') idDocument: string,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(authorization, 'No autorizado.');
    return this.documentsService.deleteDocument(idAdmin, idDocument);
  }

  @Put(':id_admin/documents/:id_document/validate')
  validateDocument(
    @Param('id_admin') idAdmin: string,
    @Param('id_document') idDocument: string,
    @Body() validateDocumentDto: ValidateDocumentDto,
    @Headers('authorization') authorization?: string,
  ) {
    this.validateBearer(authorization, 'No autorizado. Acceso restringido a administradores.');
    return this.documentsService.validateDocument(idAdmin, idDocument, validateDocumentDto);
  }

  private validateBearer(authorization: string | undefined, message: string) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        error: message,
      });
    }
  }
}
