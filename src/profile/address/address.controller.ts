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
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('api/user/address')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VOLUNTEER', 'SUPERVISOR')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) {}
  @Post()
  create(@Request() req, @Body() dto: CreateAddressDto) {
  return this.addressService.create(req.user.id_user, dto);
  }
  
  @Get()
  findAll(@Request() req) {
    return this.addressService.findAll(req.user.id_user);
  }
  
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.addressService.findOne(id, req.user.id_user);
  }
  
  @Patch(':id')
  Update(@Request() req, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(id, req.user.id_user, dto);
  }
  
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.addressService.remove(id, req.user.id_user);
  }
}