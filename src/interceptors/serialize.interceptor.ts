import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

//Practically this is a type that means 'anything as long as it is a class'
interface ClassConstructor{
    new (...args: any[]) : {};
}

// Create a custom decorator corresponding to calling the interceptor
export function Serialize(dto: ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}

// Serializes the outgoing respopnse using the details inside the provided DTO
export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto: ClassConstructor){}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any>  {
        
        // Runs before a request is handled by the request handler
        // console.log('Inside the SerializeInterceptor',context);

        // Runs after the handler
        return next.handle().pipe(
            map((data: ClassConstructor) => {
                // Run something before the response is sent out
                //console.log('I am running before the response is sent out',data);
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true   // will only expose the properties decorated with @Exposed, otherwise everything is exposed
                })
            })
        );
    }
}