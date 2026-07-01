import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EmergencyNumberService } from './emergency_number.service';
import { CreateEmergencyContactDto } from './dto/create-contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/volunteer/emergencyContact')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VOLUNTEER')
export class EmergencyNumberController {
  constructor(
    private readonly emergencyNumberService: EmergencyNumberService,
  ) {}

  @Post()
  create(@Request() req, @Body() dto: CreateEmergencyContactDto) {
    return this.emergencyNumberService.create(req.user.id_user, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.emergencyNumberService.findAll(req.user.id_user);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.emergencyNumberService.findOne(id, req.user.id_user);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateEmergencyContactDto) {
    return this.emergencyNumberService.update(id, req.user.id_user, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.emergencyNumberService.remove(id, req.user.id_user);
  }
}
