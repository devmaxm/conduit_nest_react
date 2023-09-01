import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ExpressRequestInterface } from "@app/interfaces/expressRequest.interface";

@Injectable()
export class JwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequestInterface>()
    if (request.user) {
      return true

    }
    throw new HttpException('Unautorized', HttpStatus.UNAUTHORIZED)
  }
}