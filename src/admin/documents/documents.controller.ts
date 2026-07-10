import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ValidateDocumentDto } from './dto/validate-document.dto';
import { DocumentsService } from './documents.service';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':id_admin/documents/:id_document')
  getDocument(
    @Param('id_admin') idAdmin: string,
    @Param('id_document') idDocument: string,
  ) {
    return this.documentsService.getDocument(idAdmin, idDocument);
  }

  @Delete(':id_admin/documents/:id_document/delete')
  deleteDocument(
    @Param('id_admin') idAdmin: string,
    @Param('id_document') idDocument: string,
  ) {
    return this.documentsService.deleteDocument(idAdmin, idDocument);
  }

  @Put(':id_admin/documents/:id_document/validate')
  validateDocument(
    @Param('id_admin') idAdmin: string,
    @Param('id_document') idDocument: string,
    @Body() validateDocumentDto: ValidateDocumentDto,
  ) {
    return this.documentsService.validateDocument(idAdmin, idDocument, validateDocumentDto);
  }
}
