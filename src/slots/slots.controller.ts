import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { SlotsService } from './slots.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller()
export class SlotsController {
    constructor(private readonly slotsService: SlotsService) { }

    /* ---------------- ADMIN ---------------- */

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/slots')
    createSlots(
        @Body()
        body: {
            date: string;
            slots: { time: string; capacity: number }[];
        },
    ) {
        return this.slotsService.createSlots(body.date, body.slots);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch('admin/slots/:id/block')
    blockSlot(@Param('id') id: string) {
        return this.slotsService.blockSlot(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch('admin/slots/:id/unblock')
    unblockSlot(@Param('id') id: string) {
        return this.slotsService.unblockSlot(id);
    }

    /* ---------------- CUSTOMER ---------------- */

    @Get('slots')
    getAvailableSlots(@Query('date') date: string) {
        return this.slotsService.getAvailableSlots(date);
    }
}
