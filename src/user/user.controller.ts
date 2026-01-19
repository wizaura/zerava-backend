import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    getMe(@Req() req) {
        return this.userService.getProfile(req.user.id);
    }

    @Patch('me')
    updateMe(@Req() req, @Body() dto) {
        return this.userService.updateProfile(req.user.id, dto);
    }
}
