import { Controller, Get, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { VolunteerRoutesService } from './volunteer-routes.service.js';

@Controller('api/v1/:id_volunteer/routes')
export class VolunteerRoutesController {
  constructor(private readonly volunteerRoutesService: VolunteerRoutesService) {}

  // Contrato: GET /api/{id_volunteer}/routes/{id_route}/details
  @Get(':id_route/details')
  @HttpCode(HttpStatus.OK)
  async getRouteDetails(
    @Param('id_volunteer', ParseUUIDPipe) id_volunteer: string,
    @Param('id_route', ParseUUIDPipe) id_route: string,
  ) {
    return this.volunteerRoutesService.findRouteById(id_route);
  }
}