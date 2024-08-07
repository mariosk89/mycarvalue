import { IsEmail, IsString } from "class-validator";

//A representation of the User body required for signing up
export class CreateUserDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}