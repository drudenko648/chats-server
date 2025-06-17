import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

/* eslint-disable @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-member-access */
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('signUp -> signIn', async () => {
    const signUpMutation = {
      query: `mutation($u:String!,$p:String!){signUp(data:{username:$u,password:$p}){token}}`,
      variables: { u: 'tester', p: 'password' },
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send(signUpMutation);
    expect(res.body.data.signUp.token).toBeDefined();

    const signInMutation = {
      query: `mutation($u:String!,$p:String!){signIn(data:{username:$u,password:$p}){token}}`,
      variables: { u: 'tester', p: 'password' },
    };
    const res2 = await request(app.getHttpServer())
      .post('/graphql')
      .send(signInMutation);
    expect(res2.body.data.signIn.token).toBeDefined();
  });
});
