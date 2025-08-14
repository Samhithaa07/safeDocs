import { File } from './file.entity';
import { FileResponseDto } from './dto/file-response.dto';

export function toFileResponseDto(entity: File): FileResponseDto {
  return {
    id: entity.id,
    originalName: entity.originalName,
    storedName: entity.storedName,
    size: entity.size,
    mimetype: entity.mimetype,
    createdAt: entity.createdAt,
  };
}
