import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Le especificamos lo que usamos para generar el token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}