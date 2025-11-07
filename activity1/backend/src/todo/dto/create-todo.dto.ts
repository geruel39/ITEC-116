import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Buy milk, eggs, and bread', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
