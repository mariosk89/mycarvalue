import { CanActivate, ExecutionContext } from "@nestjs/common";

// Guards are called after the middlewares (cookie-session) before the interceptors
export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if(!request.currentUser){
            return false;
        }
        return request.currentUser.admin;             
    }
}