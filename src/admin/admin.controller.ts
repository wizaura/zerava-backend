import { Controller, Get, UseGuards, Req, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller('admin')
export class AdminController {

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('me')
    getAdmin(@Request() req) {
        return {
            message: 'Admin access granted',
            user: req.user,
        };
    }
}
