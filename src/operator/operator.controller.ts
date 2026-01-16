import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { OperatorService } from './operator.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller()
export class OperatorController {
    constructor(private readonly service: OperatorService) { }

    /* -------- ADMIN -------- */

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/operators')
    getAll() {
        return this.service.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/operators')
    create(
        @Body() body: { name: string },
    ) {
        return this.service.create(body.name);
    }
}
