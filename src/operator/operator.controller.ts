import {
    Body,
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    UseGuards,
} from '@nestjs/common';
import { OperatorService } from './operator.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { AdminJwtAuthGuard } from 'src/auth/admin-auth/jwt/jwt.guard';

@Controller()
export class OperatorController {
    constructor(private readonly service: OperatorService) { }

    /* -------- ADMIN -------- */

    @UseGuards(AdminJwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/operators')
    getAll() {
        return this.service.getAll();
    }

    @UseGuards(AdminJwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/operators')
    create(@Body() body: { name: string }) {
        return this.service.create(body.name);
    }

    // ✅ UPDATE
    @UseGuards(AdminJwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch('admin/operators/:id')
    update(
        @Param('id') id: string,
        @Body() body: { name: string },
    ) {
        return this.service.update(id, body.name);
    }

    // ✅ DELETE (soft delete)
    @UseGuards(AdminJwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete('admin/operators/:id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
