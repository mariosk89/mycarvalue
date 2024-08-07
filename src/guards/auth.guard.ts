import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        // if the id exists this will return true. if not it will return false and block any further execution
        return request.session.userId;
    }
}