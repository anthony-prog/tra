// src/login/login.service.ts
import { Injectable, HttpStatus } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthService } from './jwt.service';
import * as bcrypt from 'bcrypt';
import {
  LoginDto,
  RegisterDto,
  LoginResponseDto,
  UserProfileDto,
  UserSearchDto,
} from './dto/auth.dto';
import {
  BaseResponseDto,
  EmptyResponseDto,
} from '../common/dto/base-response.dto';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { UserRole, AuthenticatedUser } from './interfaces/roles.interface';

interface DatabaseUser {
  id_usuario: string;
  nombre_usuario: string;
  rol: string;
  contrasena: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  /**
   * Registra un nuevo usuario con contraseña encriptada
   * @param registerDto - Datos del usuario a registrar
   * @returns Respuesta de registro exitoso o error si el usuario ya existe
   */
  async register(registerDto: RegisterDto): Promise<EmptyResponseDto> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      registerDto.contrasena,
      saltRounds,
    );

    await this.databaseService.query(
      `INSERT INTO Usuario (nombre_usuario, rol, contrasena) 
       VALUES ($1, $2, $3)`,
      [registerDto.nombre_usuario, registerDto.rol, hashedPassword],
    );

    return EmptyResponseDto.success('Usuario registrado exitosamente');
  }

  /**
   * Autentica un usuario y devuelve un token JWT
   * @param loginDto - Datos de inicio de sesión
   * @returns Respuesta de inicio de sesión exitoso o error si las credenciales son inválidas
   */
  async login(loginDto: LoginDto): Promise<BaseResponseDto<LoginResponseDto>> {
    const result = await this.databaseService.query(
      'SELECT * FROM Usuario WHERE nombre_usuario = $1',
      [loginDto.nombre_usuario],
    );

    if (result.rows.length === 0) {
      throw new CustomException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = result.rows[0] as DatabaseUser;

    const isPasswordValid = await bcrypt.compare(
      loginDto.contrasena,
      user.contrasena,
    );

    if (!isPasswordValid) {
      throw new CustomException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.jwtAuthService.generateToken({
      id_usuario: user.id_usuario,
    });

    return BaseResponseDto.success('Login exitoso', { token });
  }

  /**
   * Valida un token JWT y devuelve la información del usuario
   * @param token - El token JWT a validar
   * @returns La información del usuario
   */
  async validateToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = this.jwtAuthService.verifyToken(token);

      const result = await this.databaseService.query(
        'SELECT id_usuario, nombre_usuario, rol, fecha_creacion, fecha_actualizacion FROM Usuario WHERE id_usuario = $1',
        [payload.id_usuario],
      );

      if (result.rows.length === 0) {
        throw new CustomException(
          'Usuario no encontrado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = result.rows[0] as DatabaseUser;
      return {
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        rol: user.rol as UserRole,
      };
    } catch {
      throw new CustomException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }

  async getUserById(id_usuario: string): Promise<UserProfileDto> {
    const result = await this.databaseService.query(
      'SELECT nombre_usuario, rol FROM Usuario WHERE id_usuario = $1',
      [id_usuario],
    );
    return result.rows[0] as UserProfileDto;
  }

  /**
   * Busca usuarios con paginación y filtro por nombre
   * @param search - Término de búsqueda opcional para filtrar por nombre de usuario
   * @param limit - Límite de usuarios a retornar (por defecto 10)
   * @returns Lista de usuarios con id, nombre y rol
   */
  async searchUsers(
    search?: string,
    limit: number = 10,
  ): Promise<UserSearchDto[]> {
    let query = 'SELECT id_usuario, nombre_usuario, rol FROM Usuario';
    const params: any[] = [];

    if (search) {
      query += ' WHERE nombre_usuario ILIKE $1';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY nombre_usuario LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await this.databaseService.query(query, params);
    return result.rows as UserSearchDto[];
  }
}
