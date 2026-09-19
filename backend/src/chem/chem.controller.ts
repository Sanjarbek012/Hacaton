import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
import { ChemService } from './chem.service';

class MixDto {
  @IsString()
  @MaxLength(20)
  a: string;

  @IsString()
  @MaxLength(20)
  b: string;
}

@Controller('chem')
export class ChemController {
  constructor(private readonly chem: ChemService) {}

  @Get('reagents')
  reagents() {
    return this.chem.reagents();
  }

  @Post('mix')
  mix(@Body() dto: MixDto) {
    return this.chem.mix(dto.a, dto.b);
  }
}
