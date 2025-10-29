import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Llave que usaré en la metadata
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); // Genera en la metadata una llave 'roles' con los roles que le pasemos
