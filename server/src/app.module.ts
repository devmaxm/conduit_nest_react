import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import typeormConfig from "@app/config/orm/orm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "@app/users/users.module";
import { JwtAuthMiddleware } from "@app/users/middlewares/jwtAuth.middleware";
import { ArticlesModule } from "@app/articles/articles.module";
import { ProfileModule } from '@app/profile/profile.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule,
    ArticlesModule,
    ProfileModule,
    TagsModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL
      });
  }
}
