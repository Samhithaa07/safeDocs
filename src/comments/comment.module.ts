import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { FilesModule } from 'src/files/files.module';
import { Comment } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UsersModule,
    FilesModule,
    AuthModule,
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
