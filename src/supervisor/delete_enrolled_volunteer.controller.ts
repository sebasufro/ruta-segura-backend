import { Controller, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteEnrolledVolunteerService } from './delete_enrolled_volunteer.service';

@Controller('api')
export class DeleteEnrolledVolunteerController {
  constructor(
    private readonly deleteEnrolledVolunteerService: DeleteEnrolledVolunteerService,
  ) {}

  @Delete(':idSupervisor/route/volunteer/:idVolunteer/delete')
  async deleteEnrolledVolunteer(
    @Param('idSupervisor') idSupervisor: string,
    @Param('idVolunteer') idVolunteer: string,
  ) {
    try {
      return await this.deleteEnrolledVolunteerService.deleteEnrolledVolunteer(
        idSupervisor,
        idVolunteer,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message?.includes('no encontrado')) {
        throw new HttpException(
          { error: 'Recurso no encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        { error: 'Error interno del servidor' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
