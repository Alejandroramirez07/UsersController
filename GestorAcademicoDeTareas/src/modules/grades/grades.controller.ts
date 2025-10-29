import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from 'src/dto/create-grade.dto';
import { UpdateGradeDto } from 'src/dto/update-grade.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Grades')
@ApiBearerAuth()
@Controller('/api/grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @ApiOperation({ summary: 'Asignar una calificación a una tarea' })
  @ApiResponse({ status: 200, description: 'Calificación creada en la base de datos' })
  @ApiResponse({ status: 409, description: 'La tarea ya ha sido calificada' })
  @ApiResponse({ status: 404, description: 'Calificación con ese ID no existe' })
  @Roles(Role.Professor)
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza la calificación de una tarea' })
  @ApiResponse({ status: 200, description: 'Calificación actualizada en la base de datos' })
  @ApiResponse({ status: 404, description: 'Calificación con ese ID no existe' })
  @Roles(Role.Professor)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(id, updateGradeDto);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Lista del estudiante con todas sus tareas y sus calificaciones' })
  @ApiResponse({ status: 200, description: 'Un objeto con tareas y calificaciones' })
  @ApiResponse({ status: 400, description: 'El estudiante no tiene calificaciones' })
  @Roles(Role.Professor)
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradesService.findByStudent(studentId);
  }

  @Get('student/:studentId/average')
  @ApiOperation({ summary: 'Promedio de las calificaciones de un estudiante' })
  @ApiResponse({ status: 200, description: 'Un mensaje con el promedio' })
  @ApiResponse({ status: 400, description: 'El estudiante no tiene calificaciones' })
  @Roles(Role.Professor, Role.Student)
  getStudentAverage(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradesService.getStudentAverage(studentId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una calificación de la base de datos' })
  @ApiResponse({ status: 200, description: 'Calificación eliminada exitosamente en BD' })
  @ApiResponse({ status: 404, description: 'Calificación con ese ID no existe' })
  @Roles(Role.Professor)
  remove(@Param('id') id: number) {
    return this.gradesService.remove(id);
  }
}
