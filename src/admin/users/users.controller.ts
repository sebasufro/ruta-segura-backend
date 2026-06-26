import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DashboardQueryDto } from './dto/date-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id_admin/user/create')
  @UseInterceptors(FileInterceptor('certificado', { limits: { fileSize: 5 * 1024 * 1024 } }))
  createUser(
    @Param('id_admin') idAdmin: string,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() certificado?: any,
  ) {
    return this.usersService.createUser(idAdmin, createUserDto, certificado);
  }

  @Patch(':id_admin/users/:id_target/edit')
  updateUser(
    @Param('id_admin') idAdmin: string,
    @Param('id_target') idTarget: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(idAdmin, idTarget, updateUserDto);
  }

  @Get(':id_admin/users/:id_target/details')
  getUserDetails(
    @Param('id_admin') idAdmin: string,
    @Param('id_target') idTarget: string,
  ) {
    return this.usersService.getUserDetails(idAdmin, idTarget);
  }

  @Delete(':id_admin/users/:id_target/delete')
  deleteUser(
    @Param('id_admin') idAdmin: string,
    @Param('id_target') idTarget: string,
  ) {
    return this.usersService.deleteUser(idAdmin, idTarget);
  }

  @Get(':id_admin/users/all')
  getAllUsers(@Param('id_admin') idAdmin: string) {
    return this.usersService.getAllUsers(idAdmin);
  }

  @Get(':id_admin/dashboard/sos-alerts')
  getSosAlertsByDate(
    @Param('id_admin') idAdmin: string,
    @Query() query: DashboardQueryDto,
  ) {
    return this.usersService.getSosAlertsHistory(idAdmin, query);
  }

  @Get(':id_admin/dashboard/routes-completed')
  getCompletedRoutesByDate(
    @Param('id_admin') idAdmin: string,
    @Query() query: DashboardQueryDto,
  ) {
    return this.usersService.getCompletedRoutesHistory(idAdmin, query);
  }
}
