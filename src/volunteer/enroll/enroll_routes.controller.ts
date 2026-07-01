import {
  Controller,
  Body,
  Delete,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EnrollRoutesService } from './enroll_routes.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { EnrollmentRequestDto } from './dto/enrollment-request.dto';

@Controller('api/volunteer/enroll')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VOLUNTEER')
export class EnrollRoutesController {
    constructor(
        private readonly enrollRoutesService: EnrollRoutesService,
    ) {}

    @Post(':routeId')
    findOne(@Request() req, @Param('routeId') routeId: string, @Body() dto: EnrollmentRequestDto) {
        return this.enrollRoutesService.create(req.user.id_user, routeId, dto);
    }

    @Delete(':routeId')
    remove(@Request() req, @Param('routeId') routeId: string) {
        return this.enrollRoutesService.remove(req.user.id_user, routeId);
    }

}