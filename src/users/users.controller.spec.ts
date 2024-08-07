import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  //Mocks - Partial implementation allows us to only implement the functions that we need for our tests
  let userServiceMock: Partial<UsersService>;
  let authServiceMock: Partial<AuthService>;

  //Runs before each 'it' test
  beforeEach(async () => {

    userServiceMock = {
      findOne: (id: number) => {
        return Promise.resolve({id: id, email: 'a@a.com', password: 'password'} as User);
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email: email, password: 'randompassword'} as User]);
      },
      // remove: () => {

      // },
      // update: () => {

      // }
    };

    authServiceMock = {
      // signup: () => {

      // },
      signin: (email: string, password: string) => {
        return Promise.resolve({id: 1, email: email, password: password} as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
        //Registering custom implementations
        {
          //The type of the custom provider
          provide: UsersService,
          //The implementation of the custom provider
          useValue: userServiceMock
        },
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('a@a.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a@a.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    userServiceMock.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('Signin updates session object and returns user', async () => {
    const session = {userId: -10};
    const user = await controller.signin(
      {email: 'a@a.com', password: 'password'} as CreateUserDto,
      session
    );

    //mock hardcoded to return id = 1
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);

  })
});
