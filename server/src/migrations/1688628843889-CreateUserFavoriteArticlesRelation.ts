import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserFavoriteArticlesRelation1688628843889 implements MigrationInterface {
    name = 'CreateUserFavoriteArticlesRelation1688628843889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorite_articles" ("usersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_012ee0529f16e05d2423476c135" PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c125313c516fa75a55eec1a97c" ON "user_favorite_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_38f129e4ba3ee6224fd3c531f0" ON "user_favorite_articles" ("articlesId") `);
        await queryRunner.query(`ALTER TABLE "user_favorite_articles" ADD CONSTRAINT "FK_c125313c516fa75a55eec1a97c2" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorite_articles" ADD CONSTRAINT "FK_38f129e4ba3ee6224fd3c531f09" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorite_articles" DROP CONSTRAINT "FK_38f129e4ba3ee6224fd3c531f09"`);
        await queryRunner.query(`ALTER TABLE "user_favorite_articles" DROP CONSTRAINT "FK_c125313c516fa75a55eec1a97c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_38f129e4ba3ee6224fd3c531f0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c125313c516fa75a55eec1a97c"`);
        await queryRunner.query(`DROP TABLE "user_favorite_articles"`);
    }

}
