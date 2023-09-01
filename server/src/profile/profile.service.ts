import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProfileInterface } from "@app/profile/interfaces/profile.interface";
import { ProfileResponseInterface } from "@app/profile/interfaces/profileResponse.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/users/users.entity";
import { Repository } from "typeorm";
import { FollowEntity } from "@app/profile/follow.entity";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>
    ) {
    }

    async getProfile(username: string, currentUserId: number): Promise<ProfileInterface> {
        const user = await this.userRepository.findOne({
            where: { username }
        });
        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        const isFollowing = !!await this.followRepository.findOne({
            where: {
                userId: user.id,
                followerId: currentUserId
            }
        });

        let profile = {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: isFollowing
        };

        return profile;
    }

    async follow(profileUsername: string, currentUserId: number): Promise<ProfileInterface> {
        const user = await this.userRepository.findOne({ where: { username: profileUsername } });
        if (user.id === currentUserId) {
            throw new HttpException(`You can not follow of yourself`, HttpStatus.BAD_REQUEST);
        }

        const follow = await this.followRepository.findOne({
            where: {
                userId: user.id,
                followerId: currentUserId
            }
        });

        if (!follow) {
            const newFollow = new FollowEntity();
            newFollow.userId = user.id;
            newFollow.followerId = currentUserId;
            await this.followRepository.save(newFollow);
        }

        return {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: true
        };
    }

    async unfollow(profileUsername: string, currentUserId: number): Promise<ProfileInterface> {
        const user = await this.userRepository.findOne({ where: { username: profileUsername } });
        const follow = await this.followRepository.findOne({
            where: {
                userId: user.id,
                followerId: currentUserId
            }
        });
        if (follow) {
            await this.followRepository.delete({ userId: user.id, followerId: currentUserId });
        }

        return {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: false
        };
    }


    async getProfileResponse(profile: ProfileInterface): Promise<ProfileResponseInterface> {
        return { profile };
    }
}
