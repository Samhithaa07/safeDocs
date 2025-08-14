import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(@InjectRepository(File) private repo: Repository<File>) {}

  async create(dto: CreateFileDto, ownerId: number) {
    const entity = this.repo.create({
      originalName: dto.originalName,
      storedName: dto.storedName,
      size: dto.size,
      mimetype: dto.mimetype,
      owner: { id: ownerId } as any,
    });
    return this.repo.save(entity);
  }

  findByOwner(ownerId: number) {
    return this.repo.find({ where: { owner: { id: ownerId } }, order: { createdAt: 'DESC' } });
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async getDownload(id: number, user: { sub: number; role: string }) {
    const f = await this.repo.findOne({ where: { id }, relations: { owner: true } });
    if (!f) throw new NotFoundException('File not found');

    const isOwner = f.owner?.id === user.sub;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException('Forbidden');

    const absolutePath = path.resolve(f.path ?? path.join(process.cwd(), 'uploads', f.storedName));
    if (!fs.existsSync(absolutePath)) throw new NotFoundException('Physical file missing');

    return { absolutePath, originalName: f.originalName };
  }
}
