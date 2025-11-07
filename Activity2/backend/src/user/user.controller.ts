import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    try {
      return await this.userService.register(body.username, body.password);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Username already exists');
      }
      throw err;
    }
  }

  @Post('login')
    async login(@Body() body: { username: string; password: string }) {
    try {
        const user = await this.userService.login(body.username, body.password);
        return { id: user.id, username: user.username };
    } catch (err) {
        throw new BadRequestException('Invalid username or password');
    }
    }


}
