import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
// Interceptor using the DI (having dependency on the UserService)
export class CurrentUserInterceptor implements NestInterceptor{

    constructor(private userService: UsersService){}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        // handler refers to the actual endpoint handler
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};
        if(userId){
            const user = await this.userService.findOne(userId);
            request.currentUser = user;
        }
        
        return handler.handle();
    }

}