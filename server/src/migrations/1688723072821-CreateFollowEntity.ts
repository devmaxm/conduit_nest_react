import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollowEntity1688723072821 implements MigrationInterface {
    name = 'CreateFollowEntity1688723072821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_followers" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "followerId" integer NOT NULL, CONSTRAINT "PK_ee6ca6c8db6c5e06db7727f08d8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_followers"`);
    }

}
