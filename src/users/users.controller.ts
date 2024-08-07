import { Controller, 
    Post, Get, Patch, Delete, 
    Body, Param, Query, 
    NotFoundException,
    Session,
    UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) // Alternatively @UseInterceptors(new SerializeInterceptor(UserDto))
export class UsersController {

    constructor(
        private userService: UsersService, 
        private authService: AuthService
    ){}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        // @Session() session: any
        // indicates that the endpoint expect the session object handled by the 'cookie-session' library
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password);
        // Will not return a cookie related header if there are not changes in the session
        // Setting id to the same value will not return a cookie related header
        session.userId = user.id;
        return user;
    }

    @Post('signout')
    signOut(@Session() session: any){
        session.userId = null;
    }

    // @Get('/whoami')
    // whoAmI(@Session() session: any){
    //     return this.userService.findOne(session.userId);
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User){
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string){
        const user = await this.userService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        this.userService.update(parseInt(id), body);
    }
}
