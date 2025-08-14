import { Expose } from 'class-transformer';

export class FileResponseDto {
  @Expose()
  id!: number;

  @Expose()
  originalName!: string;

  @Expose()
  storedName!: string;

  @Expose()
  size!: number;

  @Expose()
  mimetype!: string;

  @Expose()
  createdAt!: Date;
}
