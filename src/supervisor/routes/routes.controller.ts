import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RouteService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { FilterRouteDto } from './dto/filter-route.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('api/routes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPERVISOR')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateRouteDto) {
    return this.routeService.create(req.user.id_user, dto);
  }

  @Get()
  findAll(@Request() req, @Query() filters: FilterRouteDto) {
    return this.routeService.findAll(req.user.id_user, filters);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.routeService.findOne(id, req.user.id_user);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateRouteDto) {
    return this.routeService.update(id, req.user.id_user, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.routeService.remove(id, req.user.id_user);
  }
}
