import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'user_followers'})
export class FollowEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    followerId: number
}