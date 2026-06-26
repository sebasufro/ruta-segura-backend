import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ListEnrolledVolunteersService } from './list_enrolled_volunteers.service';

@Controller('api')
export class ListEnrolledVolunteersController {
  constructor(
    private readonly listEnrolledVolunteersService: ListEnrolledVolunteersService,
  ) {}

  @Get(':idSupervisor/routes/:idRoute/volunteers')
  async getEnrolledVolunteers(
    @Param('idSupervisor') idSupervisor: string,
    @Param('idRoute') idRoute: string,
  ) {
    try {
      return await this.listEnrolledVolunteersService.getEnrolledVolunteers(
        idSupervisor,
        idRoute,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message?.includes('no encontrada')) {
        throw new HttpException(
          { error: 'La ruta consultada no existe.' },
          HttpStatus.NOT_FOUND,
        );
      }

      if (error.message?.includes('no es el supervisor')) {
        throw new HttpException(
          { error: 'No autorizado. El supervisor no corresponde a la ruta.' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        { error: 'Error interno del servidor al procesar la solicitud.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
