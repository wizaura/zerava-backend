import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserService } from './user.service';
import { AdminJwtAuthGuard } from 'src/auth/admin-auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req) {
        return this.userService.getProfile(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateMe(@Req() req, @Body() dto) {
        return this.userService.updateProfile(req.user.id, dto);
    }

    @UseGuards(AdminJwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('customers')
    getAllUsers() {
        return this.userService.getAllForAdmin();
    }
}
