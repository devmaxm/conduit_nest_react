import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateArticleDto } from "@app/articles/dto/createArticle.dto";
import { ArticleEntity } from "@app/articles/articles.entity";
import { DeleteResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/users/users.entity";
import { ArticleResponseInterface } from "@app/articles/interfaces/articleResponse.interface";
import slugify from "slugify";
import { UpdateArticleDto } from "@app/articles/dto/updateArticle.dto";
import { ArticlesResponseInterface } from "@app/articles/interfaces/articlesResponse.interface";
import { ArticlesFeedQueryDto } from "@app/articles/dto/articlesQuery.dto";
import { FollowEntity } from "@app/profile/follow.entity";
import { CommentResponseInterface } from "@app/articles/interfaces/commentResponse.interface";
import { CreateCommentDto } from "@app/articles/dto/createComment.dto";
import { CommentEntity } from "@app/articles/comments.entity";
import { CommentsResponseInterface } from "@app/articles/interfaces/commentsResponse.interface";

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articlesRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>,
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>
    ) {
    }

    async getBySlug(slug: string): Promise<ArticleEntity> {
        return await this.articlesRepository.findOneBy({ slug });
    }

    async getAll(query: ArticlesFeedQueryDto, currentUserId: number | null): Promise<ArticlesResponseInterface> {
        const page = query.page || 1;
        const take = query.take || 20;
        const skip = take * (page - 1);

        const queryBuilder = await this.articlesRepository.createQueryBuilder("articles")
            .leftJoinAndSelect("articles.author", "author")
            .addOrderBy("articles.createdAt", "DESC")
            .skip(skip)
            .take(take);

        if (query.author) {
            queryBuilder.andWhere("author.username = :author", { author: query.author });
        }

        if (query.tag) {
            queryBuilder.andWhere("articles.tagList LIKE :tag", { tag: `%${query.tag}%` });
        }

        if (query.favorited) {
            const user = await this.usersRepository.findOne({
                where: { username: query.favorited },
                relations: ["favoriteArticles"]
            });
            const favIds = user.favoriteArticles.map(
                (favoriteArticle) => favoriteArticle.id
            );

            if (favIds.length > 0) {
                queryBuilder.andWhere("articles.id IN (:...favIds)", { favIds });
            } else {
                queryBuilder.andWhere("1=0");
            }
        }

        const [articlesResponse, articlesCount] = await queryBuilder.getManyAndCount();

        let favoriteIds: number[] = [];
        if (currentUserId) {
            const currentUser = await this.usersRepository.findOne({
                where: { id: currentUserId },
                relations: ["favoriteArticles"]
            });
            favoriteIds = currentUser.favoriteArticles.map((el) => el.id);
        }

        const articles = articlesResponse.map(
            (article) => {
                const favorited = favoriteIds.includes(article.id);
                return {
                    ...article, favorited
                };
            }
        );

        return { articles, articlesCount };
    }

    async feed(query: ArticlesFeedQueryDto, currentUserId: number): Promise<ArticlesResponseInterface> {
        const page = query.page || 1;
        const take = query.take || 20;
        const skip = take * (page - 1);

        const follows = await this.followRepository.find({
            where: { followerId: currentUserId }
        });
        if (follows.length === 0) {
            return { articles: [], articlesCount: 0 };
        }

        const followingUserIds = follows.map(
            (follow) => follow.userId
        );


        const queryBuilder = await this.articlesRepository.createQueryBuilder("articles")
            .leftJoinAndSelect("articles.author", "author")
            .addOrderBy("articles.createdAt", "DESC")
            .where("author.id IN (:...followingUserIds)", { followingUserIds })
            .skip(skip)
            .take(take);


        const [articlesResponse, articlesCount] = await queryBuilder.getManyAndCount();

        const currentUser = await this.usersRepository.findOne({
            where: { id: currentUserId },
            relations: ["favoriteArticles"]
        });
        let favoriteIds: number[] = currentUser.favoriteArticles.map((el) => el.id);

        const articles = articlesResponse.map(
            (article) => {
                const favorited = favoriteIds.includes(article.id);
                return {
                    ...article, favorited
                };
            }
        );

        return { articles, articlesCount };
    }

    async create(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const newArticle = new ArticleEntity();
        Object.assign(newArticle, createArticleDto);

        newArticle.slug = this.generateSlug(createArticleDto.title);

        if (!newArticle.tagList) {
            newArticle.tagList = [];
        }

        newArticle.author = currentUser;

        return await this.articlesRepository.save(newArticle);
    }

    async delete(slug: string, currentUserId: number): Promise<DeleteResult> {
        const article = await this.getBySlug(slug);
        if (!article) {
            throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
        }
        if (article.author.id !== currentUserId) {
            throw new HttpException("You are not an author", HttpStatus.FORBIDDEN);
        }

        return await this.articlesRepository.delete({ slug });
    }

    async update(
        slug: string,
        currentUserId: number,
        updateArticleDto: UpdateArticleDto
    ): Promise<ArticleEntity> {
        const article = await this.getBySlug(slug);
        if (!article) {
            throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
        }
        if (article.author.id !== currentUserId) {
            throw new HttpException("You are not an author", HttpStatus.FORBIDDEN);
        }

        Object.assign(article, updateArticleDto);

        return await this.articlesRepository.save(article);
    }

    async favoriteArticle(slug: string, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.getBySlug(slug);
        const user = await this.usersRepository.findOne({
            where: { id: currentUserId },
            relations: ["favoriteArticles"]
        });

        const isNotFavorite = user.favoriteArticles.findIndex(
            (favoriteArticle) => favoriteArticle.id === article.id
        ) === -1;

        if (isNotFavorite) {
            user.favoriteArticles.push(article);
            article.favoritesCount++;
            await this.articlesRepository.save(article);
            await this.usersRepository.save(user);
        }

        return article;
    }

    async unfavoriteArticle(slug: string, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.getBySlug(slug);
        const user = await this.usersRepository.findOne({
            where: { id: currentUserId },
            relations: ["favoriteArticles"]
        });

        const favoriteIndex = user.favoriteArticles.findIndex(
            (favoriteArticle) => favoriteArticle.id === article.id
        );

        if (favoriteIndex >= 0) {
            user.favoriteArticles.splice(favoriteIndex, 1);
            article.favoritesCount--;
            await this.articlesRepository.save(article);
            await this.usersRepository.save(user);
        }

        return article;
    }

    getArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article };
    }

    private generateSlug(title: string): string {
        return slugify(title, { lower: true }) +
            "-" +
            (Math.random() * Math.pow(36, 6) | 0).toString(36);
    }

    async createComment(slug: string, currentUser: UserEntity, createCommentDto: CreateCommentDto): Promise<CommentEntity> {
        const article = await this.getBySlug(slug);
        const newComment = new CommentEntity();
        Object.assign(newComment, createCommentDto);
        newComment.author = currentUser;
        newComment.article = article;
        return await this.commentRepository.save(newComment);
    }

    async deleteComment(commentId, currentUserId): Promise<DeleteResult> {
        const comment = await this.commentRepository.findOne({ where: { id: commentId }, relations: ["author"] });
        if (!comment) {
            throw new HttpException("Comment not found", HttpStatus.NOT_FOUND);
        }
        if (comment.author.id !== currentUserId) {
            throw new HttpException("You are not an author of this comment", HttpStatus.FORBIDDEN);
        }
        return await this.commentRepository.delete({ id: commentId });
    }

    async getAllComments(slug: string): Promise<CommentsResponseInterface> {
        const comments = await this.commentRepository.createQueryBuilder("comments")
            .leftJoin("comments.article", "article")
            .leftJoinAndSelect("comments.author", "author")
            .andWhere("article.slug = :slug", { slug })
            .orderBy("comments.createdAt", "DESC")
            .getMany();
        return { comments };
    }

    getCommentResponse(comment: CommentEntity): CommentResponseInterface {
        delete comment.author.id;
        delete comment.article;
        return { comment };
    }
}
