import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import { ExpressRequestInterface } from "@app/interfaces/expressRequest.interface";
import * as jwt from 'jsonwebtoken'
import { JWT_ACCESS_SECRET_KEY } from "@app/config/env.config";
import { UsersService } from "@app/users/users.service";

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService
  ) {
  }
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      const decode = await jwt.verify(token, JWT_ACCESS_SECRET_KEY)
      req.user = await this.usersService.getById(decode.id)
      next()
    } catch (e) {
      req.user = null;
      next();
    }

  }
}