import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { VolunteerRoutesService } from './volunteer-routes.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('api/volunteer/routes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VOLUNTEER')
export class VolunteerRoutesController {
  constructor(private readonly volunteerRoutesService: VolunteerRoutesService) {}

  @Get('available')
  getAvailableRoutes(@Request() req) {
    return this.volunteerRoutesService.getAvailableRoutes(req.user.id_user);
  }

  @Get('my-enrollments')
  getMyEnrollments(@Request() req) {
    return this.volunteerRoutesService.getMyEnrollments(req.user.id_user);
  }
}
