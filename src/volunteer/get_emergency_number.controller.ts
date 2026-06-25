import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { GetEmergencyNumberService } from './get_emergency_number.service';

@Controller('api')
export class GetEmergencyNumberController {
  constructor(
    private readonly getEmergencyNumberService: GetEmergencyNumberService,
  ) {}

  @Get(':id/emergency/phone')
  async getEmergencyNumber(@Param('id') id: string) {
    try {
      return await this.getEmergencyNumberService.getEmergencyNumber(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message?.includes('no encontrado')) {
        throw new HttpException(
          { status: 'error', message: 'No se encontró un contacto de emergencia para este usuario.' },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        { status: 'error', message: 'Error interno al recuperar los datos de seguridad.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
