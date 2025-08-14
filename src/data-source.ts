import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';
import { File } from './files/file.entity';
import { Comment } from './comments/comment.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [User, File, Comment],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
