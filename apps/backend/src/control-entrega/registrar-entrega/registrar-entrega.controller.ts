import { Body, Controller, Put } from '@nestjs/common';
import { RegistrarEntregaService } from './registrar-entrega.service';
import { RegistrarEntregaDto } from './dto/registrar-entrega.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Control de Entrega')
@Controller('control-entrega/registrar-entrega')
export class RegistrarEntregaController {
  constructor(
    private readonly registrarEntregaService: RegistrarEntregaService,
  ) {}

  @Put()
  @ApiOperation({ summary: 'Registrar entrega completada' })
  async registrarEntrega(@Body() dto: RegistrarEntregaDto) {
    return await this.registrarEntregaService.actualizarEntrega(dto);
  }
}
