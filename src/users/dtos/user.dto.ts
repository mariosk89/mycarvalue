import { Expose } from "class-transformer";

//A representation of the User body returned by our service
export class UserDto {
    //@Expose will include the field in the response
    @Expose()
    id: number;
    
    @Expose()
    email: string;
}