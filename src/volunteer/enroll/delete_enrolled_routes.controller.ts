import {
  Controller,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DeleteEnrolledRoutesService, DeleteEnrollmentResponseDTO } from './delete_enrolled_routes.service';

@Controller('api')
export class DeleteEnrolledRoutesController {
  constructor(private readonly deleteEnrolledRoutesService: DeleteEnrolledRoutesService) {}

  @Delete(':idVolunteer/routes/myroutes/:idRoute/delete')
  async deleteEnrollment(
    @Param('idVolunteer') idVolunteer: string,
    @Param('idRoute') idRoute: string,
  ): Promise<DeleteEnrollmentResponseDTO> {
    try {
      if (!idVolunteer || !idRoute) {
        throw new HttpException(
          { error: 'Volunteer ID and Route ID are required' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.deleteEnrolledRoutesService.deleteEnrollment(
        idVolunteer,
        idRoute,
      );

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message.includes('no existe')) {
        throw new HttpException(
          { error: 'La ruta inscrita no existe' },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        { error: 'Error interno al intentar eliminar la inscripción de la ruta. Intente nuevamente.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
