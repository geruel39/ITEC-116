import { Controller, Post, Body, UseGuards, Get, Request, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: {username: string; password: string}) {
        return this.authService.register(body.username, body.password);
    }

    @Post('login')
    async login(@Body() body: {username: string; password: string}) {
        return this.authService.login(body.username, body.password);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('change-password')
    async changePassword(@Request() req, @Body() body: { currentPassword: string; newPassword: string }) {
        const user = req.user;
        if (!user || !user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        const result = await this.authService.changePassword(user.id, body.currentPassword, body.newPassword);
        return result;
    }


}
