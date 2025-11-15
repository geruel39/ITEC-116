import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Username for login' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'mypassword123', description: 'Password for login' })
  @IsString()
  password: string;
}