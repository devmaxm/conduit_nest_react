import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ExpressRequestInterface } from "@app/interfaces/expressRequest.interface";

export const User = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<ExpressRequestInterface>().user
    return data ? user?.[data] : user
}
)