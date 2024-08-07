import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';

// 'describe' applies a further description, used for organisation of the code and the test
describe('AuthServiceTests', () => {
    let service: AuthService;
    let usersServiceMock: Partial<UsersService>;

    beforeEach(async () => {

        const users: User[] = [];

        usersServiceMock = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random()*99999), email, password} as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };
        
        //Create a test di container
        const module = await Test.createTestingModule({        
            providers: [AuthService,
                //Registering fake or custom objects in the module
                {
                    provide: UsersService,
                    useValue: usersServiceMock
                }
            ]
        }).compile();
    
        //Test that we can get an instance of the service from the module
        service = module.get(AuthService);
    });

    // 'it' is a Test testing a single thing
    it('Can create an instance of the auth service', async () => {
        expect(service).toBeDefined();
    });

    it('Creates a new user with salted and hashed password', async () => {
        const user = await service.signup('a@a.com','password');

        expect(user.password).not.toEqual('password');
        const [salt,hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf');
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
      });
     
      it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
      });
     
      it('throws if an invalid password is provided', async () => {
        await service.signup('laskdjf@alskdfj.com', 'password');
        await expect(
          service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
        ).rejects.toThrow(BadRequestException);
      });
 

    it('Returns a user if correct password is provided', async () => {
        await service.signup('a@a.com', 'password');

        const user = await service.signin('a@a.com', 'password');

        expect(user).toBeDefined();
    })
});


