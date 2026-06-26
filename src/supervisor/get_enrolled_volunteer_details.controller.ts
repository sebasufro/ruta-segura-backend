import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { GetEnrolledVolunteerDetailsService } from './get_enrolled_volunteer_details.service';

@Controller('api')
export class GetEnrolledVolunteerDetailsController {
  constructor(
    private readonly getEnrolledVolunteerDetailsService: GetEnrolledVolunteerDetailsService,
  ) {}

  @Get(':idSupervisor/routes/:idRoute/volunteers/:idVolunteer/details')
  async getEnrolledVolunteerDetails(
    @Param('idSupervisor') idSupervisor: string,
    @Param('idRoute') idRoute: string,
    @Param('idVolunteer') idVolunteer: string,
  ) {
    try {
      return await this.getEnrolledVolunteerDetailsService.getEnrolledVolunteerDetails(
        idSupervisor,
        idRoute,
        idVolunteer,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message?.includes('no encontrado')) {
        throw new HttpException(
          { error: 'El voluntario no existe o no está en esta ruta.' },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        { error: 'Error interno al procesar la solicitud.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
