import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import { UserRole, AuthenticatedUser } from '../interfaces/roles.interface';
import { CustomException } from 'src/common/exceptions/custom.exception';

interface RequestWithUser {
  user: AuthenticatedUser;
  headers: { authorization?: string };
}

interface JwtPayload {
  id_usuario: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new CustomException(
        'Token no proporcionado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.validateUser(payload.id_usuario);

      if (!user) {
        throw new CustomException(
          'Usuario no encontrado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (!requiredRoles.includes(user.rol)) {
        throw new CustomException(
          `Acceso denegado. Tu rol actual es '${user.rol}' pero se requiere uno de: ${requiredRoles.join(', ')}`,
          HttpStatus.FORBIDDEN,
        );
      }

      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException(
        'Error de autenticación',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private extractTokenFromHeader(request: RequestWithUser): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateUser(
    userId: string,
  ): Promise<AuthenticatedUser | null> {
    try {
      const query = `
        SELECT id_usuario, nombre_usuario, rol
        FROM Usuario
        WHERE id_usuario = $1
      `;
      const result = await this.databaseService.query(query, [userId]);
      return (result.rows[0] as AuthenticatedUser) || null;
    } catch (error) {
      console.error('Error validando usuario:', error);
      return null;
    }
  }
}
