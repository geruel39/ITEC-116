import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.K. Rowling', description: 'Name of the author' })
  @IsString()
  @IsNotEmpty()
  name: string;
}