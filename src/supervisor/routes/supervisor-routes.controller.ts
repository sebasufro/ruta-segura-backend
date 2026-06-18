import {Controller,Post,Body,Put,Param,Delete,ParseUUIDPipe,HttpCode,HttpStatus} from '@nestjs/common';
import { SupervisorRoutesService } from './supervisor-routes.service.js';
import { CreateRouteDto } from './dto/create-route.dto.js'; // Asegúrate de importar tu DTO
import { UpdateRouteDto } from './dto/update-route.dto.js'; // Se recomienda un DTO para update

@Controller('api/v1/:id_supervisor/routes')
export class SupervisorRoutesController {
  constructor(private readonly supervisorRoutesService: SupervisorRoutesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id_supervisor', ParseUUIDPipe) id_supervisor: string, 
    @Body() createDto: CreateRouteDto // Validación automática activada
  ) {
    return this.supervisorRoutesService.createRoute(id_supervisor, createDto);
  }

  @Put(':id_route')
  async update(
    @Param('id_supervisor', ParseUUIDPipe) id_supervisor: string,
    @Param('id_route', ParseUUIDPipe) id_route: string,
    @Body() updateDto: UpdateRouteDto // Se recomienda usar un DTO aquí también
  ) {
    // Si necesitas validar que la ruta pertenezca al supervisor, 
    // pásale ambos IDs al servicio.
    return this.supervisorRoutesService.updateRoute(id_route, updateDto);
  }

  @Delete(':id_route')
  @HttpCode(HttpStatus.NO_CONTENT) // Lo estándar para eliminaciones exitosas
  async remove(@Param('id_route', ParseUUIDPipe) id_route: string) {
    return this.supervisorRoutesService.deleteRoute(id_route);
  }
}