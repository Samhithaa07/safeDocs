import {
  Controller, Post, UseGuards, UseInterceptors, UploadedFile,
  Get, Param, Res, Req, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { Response, Request } from 'express';
import { toFileResponseDto } from './file.mapper';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

const allowed = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
]);

const storage = diskStorage({
  destination: path.join(process.cwd(), 'uploads'),
  filename: (req, file, cb) => cb(null, uuid() + path.extname(file.originalname)),
});

function fileFilter(req: any, file: Express.Multer.File, cb: (err: any, accept: boolean) => void) {
  if (!allowed.has(file.mimetype)) return cb(new BadRequestException('Invalid file type'), false);
  cb(null, true);
}

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  }))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) throw new BadRequestException('No file uploaded');
    const dto: CreateFileDto = {
      originalName: file.originalname,
      storedName: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
    const entity = await this.filesService.create(dto, (req as any).user.sub);
    return toFileResponseDto(entity);
  }

  @Get()
  async myFiles(@Req() req: Request) {
    const list = await this.filesService.findByOwner((req as any).user.sub);
    return list.map(toFileResponseDto);
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const { absolutePath, originalName } = await this.filesService.getDownload(+id, (req as any).user);
    return res.download(absolutePath, originalName);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('admin/all')
  async allFiles() {
    const list = await this.filesService.findAll();
    return list.map(toFileResponseDto);
  }
}