import { ArticleEntity } from "@app/articles/articles.entity";

export interface ArticlesResponseInterface {
  articles: ArticleEntity[];
  articlesCount: number;
}