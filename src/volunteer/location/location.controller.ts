import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { SendLocationDto } from './dto/send-location.dto';
import { ToggleSosDto } from './dto/toggle-sos.dto';
import { LocationService } from './location.service';

@Controller('api/volunteer/location')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VOLUNTEER')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get(':routeId')
  getRouteLocations(@Request() req, @Param('routeId') routeId: string) {
    return this.locationService.getRouteLocations(req.user.id_user, routeId);
  }

  @Post()
  sendLocation(@Request() req, @Body() dto: SendLocationDto) {
    return this.locationService.sendLocation(req.user.id_user, dto);
  }

  @Patch('sos')
  toggleSos(@Request() req, @Body() dto: ToggleSosDto) {
    return this.locationService.toggleSos(req.user.id_user, dto);
  }
}
