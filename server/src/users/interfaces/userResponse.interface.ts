import { UserType } from "@app/users/interfaces/user.type";

export interface UserResponseInterface {
  user: UserType & {token: string}
}