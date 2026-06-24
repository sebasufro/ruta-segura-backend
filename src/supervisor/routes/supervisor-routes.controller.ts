import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { SupervisorRoutesService } from './supervisor-routes.service.js';
import { CreateRouteDto } from './dto/create-route.dto.js';
import { UpdateRouteDto } from './dto/update-route.dto.js';

@Controller('api/v1/:id_supervisor/routes')
export class SupervisorRoutesController {
  constructor(private readonly supervisorRoutesService: SupervisorRoutesService) {}

  @Get('created')
  @HttpCode(HttpStatus.OK)
  async getCreatedRoutes(
    @Param('id_supervisor', ParseUUIDPipe) id_supervisor: string,
  ) {
    return this.supervisorRoutesService.findCreatedRoutes(id_supervisor);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id_supervisor', ParseUUIDPipe) id_supervisor: string,
    @Body() createDto: CreateRouteDto,
  ) {
    return this.supervisorRoutesService.createRoute(id_supervisor, createDto);
  }

  @Put(':id_route')
  async update(
    @Param('id_supervisor', ParseUUIDPipe) id_supervisor: string,
    @Param('id_route', ParseUUIDPipe) id_route: string,
    @Body() updateDto: UpdateRouteDto,
  ) {
    return this.supervisorRoutesService.updateRoute(id_route, updateDto);
  }

  @Delete(':id_route/delete')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id_route', ParseUUIDPipe) id_route: string) {
    return this.supervisorRoutesService.deleteRoute(id_route);
  }
}