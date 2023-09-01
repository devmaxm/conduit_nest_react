import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserColumnName1688466986579 implements MigrationInterface {
    name = 'FixUserColumnName1688466986579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "boi" TO "bio"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "bio" TO "boi"`);
    }

}
