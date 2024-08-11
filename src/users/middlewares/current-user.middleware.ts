import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request,Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

// Hacks the request object so to include a current user field of type User (entity)
declare global {
    namespace Express {
        interface Request{
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{

    constructor(private userService: UsersService){}

    async use(req: Request, res: Response, next: NextFunction) //nest is a reference to the next middleware
    {
        const { userId } = req.session || {};

        if(userId){
            // find the user in the database
            const user = await this.userService.findOne(userId);
            // set the user as a variable on the request
            // tells typescript to ignore the error @ts-ignore 
            req.currentUser = user;
        } 
        next();
    }
}