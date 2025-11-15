import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Username already exists' })
  async register(@Body() dto: RegisterUserDto) {
    try {
      return await this.userService.register(dto.username, dto.password);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Username already exists');
      }
      throw err;
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid username or password' })
  async login(@Body() dto: LoginUserDto) {
    try {
      const user = await this.userService.login(dto.username, dto.password);
      return { id: user.id, username: user.username };
    } catch (err) {
      throw new BadRequestException('Invalid username or password');
    }
  }
}