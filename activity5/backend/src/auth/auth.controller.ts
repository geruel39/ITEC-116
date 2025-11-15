import { Controller, Post, Body, UseGuards, Get, Request, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Username already exists' })
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto.username, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @Get('profile')
  @ApiOperation({ summary: 'Get profile of authenticated user' })
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @Patch('change-password')
  @ApiOperation({ summary: 'Change password for authenticated user' })
  async changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    const user = req.user;
    if (!user || !user.id) {
      return { success: false, message: 'Unauthorized' };
    }

    return this.authService.changePassword(
      user.id,
      body.currentPassword,
      body.newPassword
    );
  }
}