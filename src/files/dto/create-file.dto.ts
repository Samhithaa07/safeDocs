import { IsString, IsInt, Min } from 'class-validator';

export class CreateFileDto {
  @IsString()
  originalName!: string;

  @IsString()
  storedName!: string;

  @IsInt()
  @Min(0)
  size!: number;

  @IsString()
  mimetype!: string;
}
