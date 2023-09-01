import {Request} from "express";
import { UserEntity } from "@app/users/users.entity";

export interface ExpressRequestInterface extends Request {
  user?: UserEntity
}