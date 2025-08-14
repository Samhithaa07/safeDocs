import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { File } from 'src/files/file.entity';
import { Comment } from 'src/comments/comment.entity';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, File, Comment]),
    AuthModule,
    FilesModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
