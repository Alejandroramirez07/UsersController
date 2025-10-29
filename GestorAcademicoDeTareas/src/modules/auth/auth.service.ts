import { Injectable, UnauthorizedException } from '@nestjs/common';
/* dto's */
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginDto } from 'src/dto/login.dto';
/* Repositorios */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
/* services */
import { UsersService } from '../users/users.service';
/* entities */
import { User } from 'src/entities/user.entity';
/* libraries */
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtService: JwtService
    ) { }


    /**
     * register
     *
     * Registra un nuevo usuario:
     * 1. Hashea la contraseña proporcionada.
     * 2. Persiste el usuario en la base de datos.
     * 3. Devuelve un mensaje y los campos públicos del usuario (no incluye hash).
     *
     * param data - CreateUserDto con los datos del nuevo usuario (incluye password)
     * returns objeto con mensaje y datos públicos del usuario creado
     */
    async register(data: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const registerUser = this.userRepo.create({ ...data, passwordHash: hashedPassword });

        await this.userRepo.save(registerUser);
        return { message: 'El usuario ha sido creado exitosamente', user: { id: registerUser.id, email: registerUser.email, firstName: registerUser.firstName, lastName: registerUser.lastName } };

    }


    /**
     * login
     *
     * Autentica a un usuario:
     * 1. Buscar al usuario por email.
     * 2. Si no existe, lanzar UnauthorizedException.
     * 3. Comparar la contraseña proporcionada con el passwordHash usando bcrypt.compare.
     * 4. Si la contraseña es válida, generar y devolver un JWT con la información mínima del usuario.
     *
     * param data - LoginDto con email y password
     * returns objeto con accessToken (JWT)
     * throws UnauthorizedException en caso de credenciales inválidas
     */
    async login(data: LoginDto) {

        const user = await this.userRepo.findOne({ where: { email: data.email } });

        if (!user) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Credenciales invalidas");

        }

        const payloadToken = { id: user.id, email: user.email, role: user.role };
        const jsonJwt = await this.jwtService.signAsync(payloadToken);

        return { accessToken: jsonJwt };
    }
}
