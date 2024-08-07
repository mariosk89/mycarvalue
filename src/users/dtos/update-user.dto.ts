import { IsEmail, IsString, IsOptional } from "class-validator";

//A representation of the User body required for updating a user. Fields are optional so that we can only update one
export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;
    @IsString()
    @IsOptional()
    password: string;
}