import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EnrolledVolunteersService } from './enrolled_volunteers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/routes/enrolled/:routeId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPERVISOR')
export class EnrolledVolunteersController {
    constructor(
        private readonly enrolledVolunteersService: EnrolledVolunteersService,
    ) {}
    
    @Get()
    findAll(@Param('routeId') routeId: string) {
        return this.enrolledVolunteersService.findAll(routeId);
    }

    @Get(':volunteerId')
    findOne(@Param('routeId') routeId: string, @Param('volunteerId') volunteerId: string) {
        return this.enrolledVolunteersService.findOne(routeId, volunteerId);
    }

    @Delete(':volunteerId')
    remove(@Param('routeId') routeId: string, @Param('volunteerId') volunteerId: string) {
        return this.enrolledVolunteersService.remove(routeId, volunteerId);
    }
}