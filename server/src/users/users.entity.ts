import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import * as bcrypt from 'bcrypt'
import { BCRYPT_SALT } from "@app/config/env.config";
import { ArticleEntity } from "@app/articles/articles.entity";
import { CommentEntity } from "@app/articles/comments.entity";

@Entity({name: 'users'})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  username: string

  @Column({default: ""})
  bio: string

  @Column({default: "default_user_avatar.png"})
  image: string

  @Column({select: false})
  password: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, parseInt(BCRYPT_SALT))
  }

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[]

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[]

  @ManyToMany(() => ArticleEntity)
  @JoinTable({name: 'user_favorite_articles'})
  favoriteArticles: ArticleEntity[]
}