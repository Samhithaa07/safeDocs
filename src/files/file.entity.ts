import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalName: string;

  @Column()
  storedName: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;
  
  @Column()
  text: string;

  @Column('text', { array: true })
  tags: string[];

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.file)
  comments: Comment[];
}
