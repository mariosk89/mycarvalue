import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// Parameter Decorators can not use the DI. Hence they cannot access the UserService
// We need to combine it with an interceptor
export const CurrentUser = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        // ExecutionContext: wrapper around incoming request regardless of the protocol (HTTP, WS, Grpc, GraphQL)
        const request = context.switchToHttp().getRequest();
        return request.currentUser;
    }
)