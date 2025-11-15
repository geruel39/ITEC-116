import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Username for registration' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'mypassword123', description: 'Password for registration' })
  @IsString()
  @MinLength(6)
  password: string;
}