import { Module } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { ArticlesController } from "./articles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "@app/articles/articles.entity";
import { UsersModule } from "@app/users/users.module";
import { ProfileModule } from "@app/profile/profile.module";
import { CommentEntity } from "@app/articles/comments.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ArticleEntity, CommentEntity]),
        UsersModule,
        ProfileModule
    ],
    providers: [ArticlesService],
    controllers: [ArticlesController]
})
export class ArticlesModule {
}
