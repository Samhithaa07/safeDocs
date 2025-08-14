import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/user.entity';
import { File } from 'src/files/file.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  async createComment(
    dto: CreateCommentDto,
    user: Omit<User, 'password' | 'role'>,
    fileId: number,
  ): Promise<Comment> {
    return await this.dataSource.transaction(async (manager) => {
      const file = await manager.findOne(File, { where: { id: fileId } });
      if (!file) throw new NotFoundException('File not found');

      const comment = manager.create(Comment, {
        text: dto.text,
        user,
        file,
      });

      const saved = await manager.save(Comment, comment);
      await manager.increment(File, { id: file.id }, 'commentsCount', 1);

      return saved;
    });
  }

  async findByFileId(
    fileId: number,
    page = 1,
    limit = 10,
  ): Promise<{
    data: Comment[];
    meta: {
      total: number;
      page: number;
      lastPage: number;
    };
  }> {
    const [data, total] = await this.commentsRepository.findAndCount({
      where: { file: { id: fileId } },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        user: true,
      },
      order: { createdAt: 'DESC' },
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async updateComment(
    id: number,
    dto: UpdateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('Access denied');

    if (dto.text !== undefined) comment.text = dto.text;

    const saved = await this.commentsRepository.save(comment);
    return saved;
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const comment = await manager.findOne(Comment, {
        where: { id },
        relations: {
          user: true,
          file: true,
        },
      });

      if (!comment) throw new NotFoundException('Comment not found');
      if (comment.user.id !== userId)
        throw new ForbiddenException('Access denied');

      await manager.delete(Comment, id);
      await manager.decrement(
        File,
        { id: comment.file.id },
        'commentsCount',
        1,
      );
    });
  }
}
