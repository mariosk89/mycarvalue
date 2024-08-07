import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });


  it('Handles a signup request', () => {

    const emailAddress = 'a@a.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailAddress, password: 'password' })
      .expect(201)          //expected http status 201
      .then((res) => {
        const {id,email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(emailAddress);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const emailAddress = 'b@b.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: emailAddress, password: 'password' })
      .expect(201);          //expected http status 201
      
      // get the cookie returned by the signup request
      const cookie = res.get('Set-Cookie');

      const {body} = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', cookie)
        .expect(200);

        expect(body.email).toEqual(emailAddress);
  });
});
