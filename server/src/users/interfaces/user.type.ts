import { UserEntity } from "@app/users/users.entity";

export type UserType = Omit<UserEntity, 'hashPassword'>