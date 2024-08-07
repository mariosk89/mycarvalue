import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

//Practically this is a ype that means 'anything as long as it is a class'
interface ClassConstructor{
    new (...args: any[]) : {};
}

// Create a custom decorator corresponding to calling the interceptor
export function Serialize(dto: ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto: ClassConstructor){}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any>  {
        
        // Run before a request is handled by the request handler
        console.log('Inside the SerializeInterceptor',context);

        // Run after the handler
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