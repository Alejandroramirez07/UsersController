import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users') 
@ApiBearerAuth() 
@Controller('/api/users')  
@UseGuards(JwtAuthGuard, RolesGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  @Roles(Role.Professor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida' })
  @Roles(Role.Professor, Role.Student)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('role/students')
  @ApiOperation({ summary: 'Obtener todos los estudiantes' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes obtenida' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @Roles(Role.Professor) // Only professors can see all students
  findAllStudents() {
  return this.usersService.findAllStudents();
}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Roles(Role.Professor, Role.Student)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Si es Student, solo puede ver su propio perfil
    if (req.user.role === Role.Student && req.user.id !== id) {
      throw new UnauthorizedException('Solo puedes ver tu propio perfil');
    }
    return this.usersService.findOne(id);
  }

  @Get('profile/me')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @Roles(Role.Professor, Role.Student)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Roles(Role.Professor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('profile/me')
  @ApiOperation({ summary: 'Actualizar el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado' })
  @Roles(Role.Professor, Role.Student)
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
 // Remove (deactivate) user
  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Roles(Role.Professor)
  deactivate(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.deactivate(id);
 }
}