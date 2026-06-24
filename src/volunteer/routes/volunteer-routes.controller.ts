import { Controller, Get, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { VolunteerRoutesService } from './volunteer-routes.service.js';

@Controller('api/v1/:id_volunteer/routes')
export class VolunteerRoutesController {
  constructor(private readonly volunteerRoutesService: VolunteerRoutesService) {}

  @Get('myroutes')
  @HttpCode(HttpStatus.OK)
  async getMyRoutes(
    @Param('id_volunteer', ParseUUIDPipe) id_volunteer: string,
  ) {
    return this.volunteerRoutesService.findMyRoutes(id_volunteer);
  }

  @Get(':id_route/details')
  @HttpCode(HttpStatus.OK)
  async getRouteDetails(
    @Param('id_volunteer', ParseUUIDPipe) id_volunteer: string,
    @Param('id_route', ParseUUIDPipe) id_route: string,
  ) {
    return this.volunteerRoutesService.findRouteById(id_route);
  }
}