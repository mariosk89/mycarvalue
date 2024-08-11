import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

// promisify is a nest util method that 'converts' callsbacks (returned by scypt in this case)
// as Promises, so that we can better control our application
// 'scrypt' is imported with an alias in the import statement above

const promisifiedScrypt = promisify(_scrypt);

@Injectable()
export class AuthService{
    constructor(private userService: UsersService){ }

    async signup(email: string, password: string){

        // 1. Check if email is in use
        const users = await this.userService.find(email);
        if(users.length){
            throw new BadRequestException('Email already in use');
        }

        // 2. Hash user password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');
        // Hash the salt and the password together
        // (third argument is length of hash string)
        // (casting the result as Buffer bacause typescript does not work well with promisify)
        const hash = (await promisifiedScrypt(password, salt, 32)) as Buffer;
        
        // Join the hashed result and the salt together (split by '.')
        const result = salt + '.'+ hash.toString('hex');

        // 3. Create new user and save it
        const user = await this.userService.create(email, result);

        // 4. Return the new user
        return user;
    }

    async signin(email: string, password: string){
        
        // 1. Find if the user exists (by email)
        // [user] means we assume we get back ONE user (the function retuens a list
        const [user] = await this.userService.find(email);
        if(!user){
            throw new NotFoundException('Sign in - User not found');
        }
        // 2. Getting the hash and the salt
        const [salt, storedHash] = user.password.split('.');

        // 3. Encrypt the provided password with the salt stored in the DB
        const hash = (await promisifiedScrypt(password, salt, 32)) as Buffer;

        // 4. Check if the hashed values match
        if(storedHash !== hash.toString('hex')){
            throw new BadRequestException('Wrong password');
        }
        
        return user;
    }
}