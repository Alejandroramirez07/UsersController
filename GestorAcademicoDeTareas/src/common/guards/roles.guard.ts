import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true; // Si no hay roles requeridos, cualquiera puede acceder

    const { user } = context.switchToHttp().getRequest(); // Obtenemos el usuario de la petición

    if (!user) throw new ForbiddenException('Usuario no autenticado'); // Si no hay usuario, no puede acceder

    //TODO: Reemplazar la excepción personalizada
    if (!requiredRoles.includes(user.role)) {
      throw new NotFoundException(
        'Su rol no tiene permisos para acceder a esta ruta',
      );
    }

    return true;
  }
}
