import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginControlEntregaDto } from './dto/login-control-entrega.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Control de Entrega')
@Controller('control-entrega/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login para control de entrega',
    description:
      'Autentica a un repartidor para el sistema de control de entrega',
  })
  @ApiBody({
    type: LoginControlEntregaDto,
    description: 'Credenciales del repartidor',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login successful' },
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            username: { type: 'string', example: 'repartidor1' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    type: ErrorResponseDto,
  })
  async login(@Body() body: LoginControlEntregaDto): Promise<{
    message: string;
    access_token: string;
    user: { id: string; username: string };
  }> {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user,
    };
  }
}
