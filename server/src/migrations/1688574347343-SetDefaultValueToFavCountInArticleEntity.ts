import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueToFavCountInArticleEntity1688574347343 implements MigrationInterface {
    name = 'SetDefaultValueToFavCountInArticleEntity1688574347343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "favoritesCount" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "favoritesCount" DROP DEFAULT`);
    }

}
