import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "@app/users/users.entity";
import { ArticleEntity } from "@app/articles/articles.entity";

@Entity({name: 'comments'})
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    body: string

    @CreateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @UpdateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date

    @ManyToOne(() => UserEntity)
    author: UserEntity

    @ManyToOne(() => ArticleEntity, (article) => article.comments)
    article: ArticleEntity
}