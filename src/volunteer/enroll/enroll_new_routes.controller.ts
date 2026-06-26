import { Controller, Post, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { EnrollNewRoutesService, EnrollmentResponseDTO } from './enroll_new_routes.service';
import { EnrollmentRequestDTO } from './DTO/enrollment_request.dto';

@Controller('api')
export class EnrollNewRoutesController {
  constructor(private readonly enrollNewRoutesService: EnrollNewRoutesService) {}

  @Post(':idVolunteer/routes/:idRoute/enroll')
  async enrollInRoute(
    @Param('idVolunteer') idVolunteer: string,
    @Param('idRoute') idRoute: string,
    @Body() enrollmentData: EnrollmentRequestDTO,
  ): Promise<EnrollmentResponseDTO> {
    try {
      if (!idVolunteer || !idRoute) {
        throw new HttpException(
          { error: 'Volunteer ID and Route ID are required' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!enrollmentData.id_volunteer) {
        throw new HttpException(
          { error: 'id_volunteer in request body is required' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verify that the volunteer ID in the URL matches the one in the body
      if (enrollmentData.id_volunteer !== idVolunteer) {
        throw new HttpException(
          { error: 'Volunteer ID mismatch' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.enrollNewRoutesService.enrollVolunteerInRoute(
        idVolunteer,
        idRoute,
        enrollmentData,
      );

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Map specific error types to HTTP status codes
      if (error.message.includes('no encontrada')) {
        throw new HttpException(
          { error: 'Ruta no encontrada.' },
          HttpStatus.NOT_FOUND,
        );
      }

      if (error.message.includes('Ya te encuentras')) {
        throw new HttpException(
          { error: 'Ya te encuentras inscrito en esta ruta.' },
          HttpStatus.CONFLICT,
        );
      }

      if (error.message.includes('capacidad máxima')) {
        throw new HttpException(
          { error: 'La ruta ha alcanzado su capacidad máxima.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        { error: 'Error interno al inscribirse en la ruta' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
