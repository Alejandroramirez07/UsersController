import { Controller, Body, Request, UseGuards,Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('authM')
export class AuthController {

    constructor(private authService: AuthService) { }


    /**
     * register
     *
     * Endpoint para registrar un nuevo usuario.
     * Método: POST
     * Ruta: /authM/register
     * param data - CreateUserDto con los datos del nuevo usuario (incluye password)
     * returns resultado del registro (mensaje y datos públicos del usuario)
     */
    @Post('register')
    register(@Body() data: CreateUserDto) {
        return this.authService.register(data);
    }


    /**
     * login
     *
     * Endpoint para autenticar un usuario y emitir un JWT.
     * Método: POST
     * Ruta: /authM/login
     * param data - LoginDto con email y password
     * returns objeto con accessToken (JWT) si las credenciales son válidas
     *
     */

    @Post('login')
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    /**
     * getProfile
     *
     * Endpoint protegido que devuelve la información del usuario autenticado.
     * Método: GET
     * Ruta: /authM/profile
     * Protegido por: JwtAuthGuard
     * param req - objeto Request; se espera req.user poblado por el guard/strategy JWT
     * returns usuario autenticado (según lo expuesto por el strategy)
     *
     * Notas de implementación:
     * - Tipar `req` para mejorar la seguridad de tipos, por ejemplo:
     *      getProfile(@Request() req: { user: Partial<User> }) { ... }
     * - Asegúrate de que el JWT strategy coloque en `req.user` solo los campos necesarios.
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}
