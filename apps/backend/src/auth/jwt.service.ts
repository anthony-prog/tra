import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: NestJwtService) {}

  /**
   * Genera un token JWT con el ID del usuario
   * @param payload - El payload del token
   * @returns El token JWT
   */
  generateToken(payload: { id_usuario: string }): string {
    return this.jwtService.sign(payload);
  }

  /**
   * Verifica y decodifica un token JWT
   * @param token - El token JWT a verificar
   * @returns El payload del token
   */
  verifyToken(token: string): { id_usuario: string } {
    return this.jwtService.verify(token);
  }

  /**
   * Extrae el ID del usuario del token
   * @param token - El token JWT a extraer el ID del usuario
   * @returns El ID del usuario
   */
  extractUserIdFromToken(token: string): string {
    const decoded = this.verifyToken(token);
    return decoded.id_usuario;
  }
}
