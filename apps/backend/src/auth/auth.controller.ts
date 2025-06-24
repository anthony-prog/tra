import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiExtraModels,
} from '@nestjs/swagger';
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
import { ApiDeepNestedOkResponse } from '../common/swagger/api-nested-ok-response.helper';
import { CurrentUser } from './decorators/current-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UserRole, AuthenticatedUser } from './interfaces/roles.interface';

@ApiTags('Autenticación')
@ApiExtraModels(BaseResponseDto, UserSearchDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario con contraseña encriptada',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Datos del usuario a registrar',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario registrado exitosamente',
    type: EmptyResponseDto,
  })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<EmptyResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica un usuario y devuelve un token JWT que contiene el ID del usuario',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales de acceso',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, LoginResponseDto],
    'Login exitoso - Token JWT generado',
  )
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    type: ErrorResponseDto,
  })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<BaseResponseDto<LoginResponseDto>> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @Auth(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.OPERADOR,
    UserRole.MONITOR,
  )
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description:
      'Obtiene la información del usuario autenticado (solo admin, supervisor, operador y monitor)',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, UserProfileDto],
    'Perfil del usuario obtenido exitosamente',
  )
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Rol insuficiente',
    type: ErrorResponseDto,
  })
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BaseResponseDto<UserProfileDto>> {
    const userProfile = await this.authService.getUserById(user.id_usuario);
    return BaseResponseDto.success('Perfil obtenido exitosamente', userProfile);
  }

  @Get('users')
  @Auth(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.OPERADOR)
  @ApiOperation({
    summary: 'Buscar usuarios',
    description:
      'Obtiene los primeros 10 usuarios con opción de búsqueda por nombre',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Término de búsqueda para filtrar por nombre de usuario',
    example: 'admin',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de usuarios a retornar (por defecto 10)',
    example: 10,
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, [UserSearchDto]],
    'Usuarios obtenidos exitosamente',
  )
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Rol insuficiente',
    type: ErrorResponseDto,
  })
  async searchUsers(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
  ): Promise<BaseResponseDto<UserSearchDto[]>> {
    const limitNumber =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
    const users = await this.authService.searchUsers(search, limitNumber);
    return BaseResponseDto.success('Usuarios obtenidos exitosamente', users);
  }
}
