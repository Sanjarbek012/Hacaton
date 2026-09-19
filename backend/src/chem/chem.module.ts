import { Module } from '@nestjs/common';
import { ChemController } from './chem.controller';
import { ChemService } from './chem.service';

@Module({ controllers: [ChemController], providers: [ChemService] })
export class ChemModule {}
