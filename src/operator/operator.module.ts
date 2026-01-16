import { Module } from '@nestjs/common';
import { OperatorController } from './operator.controller';
import { OperatorService } from './operator.service';
import { OperatorRepository } from './operator.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [OperatorController],
    providers: [OperatorService, OperatorRepository, PrismaService]
})
export class OperatorModule {}
