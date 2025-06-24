import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmptyResponseDto } from 'src/common/dto/base-response.dto';
import { CreateDespachoDto } from 'src/gestion-despacho/dto/create-despacho.dto';
import { CreateRechazoDespachoDto } from 'src/gestion-despacho/dto/create-rechazodespacho.dto';
import { GestionDespachoService } from './gestion-despacho.service';

@ApiTags('GestionDespacho')
@Controller('gestion-despacho')
export class GestionDespachoController {
  constructor(
    private readonly gestionDespachoService: GestionDespachoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Despacho insertado correctamente',
    type: EmptyResponseDto,
  })
  @ApiBody({
    type: CreateDespachoDto,
    description: 'Despacho a insertar',
  })
  @ApiOperation({
    summary: 'Insertar un despacho',
    description: 'Inserta un nuevo despacho en la base de datos',
  })
  async insertarDespacho(
    @Body() despacho: CreateDespachoDto,
  ): Promise<EmptyResponseDto> {
    await this.gestionDespachoService.insertarDespacho(despacho);
    return EmptyResponseDto.success('Despacho insertado correctamente');
  }

  @Post('rechazo')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Rechazo de despacho registrado correctamente',
    type: EmptyResponseDto,
  })
  @ApiBody({
    type: CreateRechazoDespachoDto,
    description: 'Rechazo a registrar',
  })
  @ApiOperation({
    summary: 'Registrar rechazo de despacho',
    description: 'Registra un nuevo rechazo de despacho en la base de datos',
  })
  async registrarRechazoDespacho(
    @Body() rechazo: CreateRechazoDespachoDto,
  ): Promise<EmptyResponseDto> {
    await this.gestionDespachoService.insertarRechazoDespacho(rechazo);
    return EmptyResponseDto.success(
      'Rechazo de despacho registrado correctamente',
    );
  }
}
