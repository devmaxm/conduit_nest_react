import { Module } from "@nestjs/common";
import { ProfileService } from "@app/profile/profile.service";
import { ProfileController } from "@app/profile/profile.controller";
import { UsersModule } from "@app/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowEntity } from "@app/profile/follow.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([FollowEntity]),
        UsersModule
    ],
    providers: [ProfileService],
    controllers: [ProfileController],
    exports: [TypeOrmModule]
})
export class ProfileModule {
}
