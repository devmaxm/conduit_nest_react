import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1688628843889 implements MigrationInterface {
    name = "SeedDb1688628843889";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // password admin
        await queryRunner.query(
            `INSERT INTO users (username, email, password, image) VALUES ('admin', 'admin@gmail.com', '$2b$05$yYOZX2ucex7la3VbYStCcOBpvcKZQRAXTnzPaaDfNF2y2FApJWMGO', 'default_user_avatar.png')`
        );

        // password test
        await queryRunner.query(
            `INSERT INTO users (username, email, password, image) VALUES ('test', 'test@gmail.com', '$2b$05$S2q2/E7Hc.mK7tfxeKshNeFu163cskj8U7jHzuoKTc517OAzq3uOW', 'default_user_avatar.png')`
        );

        await queryRunner.query(
            `INSERT INTO articles (title, description, body, "tagList", slug, "authorId") VALUES ('First article', 'First article desc', 'First article body', 'test,test1,test2', 'first-article', '1')`
        );

        await queryRunner.query(
            `INSERT INTO articles (title, description, body, "tagList", slug, "authorId") VALUES ('Second article', 'Second article desc', 'Second article body', 'test,test2', 'second-article', '1')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
