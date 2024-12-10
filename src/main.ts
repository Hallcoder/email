import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

async function bootstrap() {
  dotenv.config();
  
  // Initialize Firebase Admin
  const serviceAccount = {
    type: 'service_account',
    project_id: 'monitorme-fee8c',
    private_key_id: 'b14fb2fa1872d615b57a2aa15534d9ee2e56125f',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuw+U9OeMFsk6C\nzOVfCb0+EHbP7dDxS9a8iQgB+IZOXPFb8Z6GB4/Ky1ipXzUQkddwB9IaWBRaZHMg\nKqTRrMUhyKlqPz+2FFyve/yYZ4tL+d9pNUesh8sSY9nW8U+IOUJuVUwVBl0ezUaI\nCRbaWsHdFmMI+fPz1gJNfEdw5zxcriWq2iQv1E4mGi7wFmzUf9m3xHeUEIzq8nl7\n6GG1QFTVWudrm1Au/+KvuAHOsKFiYd/35ZoUNfbEkPyGhVb0USeotwU+Aka1jAkp\nC4+mZIHVcAOlJXkB8zB7hEW1boo7vAgWDAtAttGkjvOuOB4Wx6ovr0U/Oz9CGbuU\n/MAsjcyHAgMBAAECggEAFLA8/W6nrioe+tii7d67HSiZdWDmOK0CenwloLIZGBgO\n5xRRxfUJiSIMWLSGwB47qNf21Rvd1kYzjg3DnXdR439xIBI6X7rGWWxt3mQiNyLD\n10exjejfWcnMj7zY7jvfs4GmdDYLelTQ8ilSoBOur8DxhVkC5OJ4kE/+LGKQoI83\nMnr1WOPpwR1+tbghtuixt3h8BaA1ftVgbCiJUONUVvDxKvhkt+fiincue6XtIb6g\nRgBSeZN1Rsf68JPdP5T0ZSsXdqJJeoQpnuqLW4nyzitFBOth+RAUmeBv2mVoQtGP\nHZ2udPXm6dIlTxGcg0OAX/Ehdkam4ZUUZsGRJKGd+QKBgQC53yiXkXVXyOQIfJz6\nF5AtUJ4g6p9B9LB2g5YuOZR0ztZkl9KHtXOZR3lcKJsPevNCzEegoo4rin+Iauqv\nm19vriw2x3FBUtAtixnaTlcFmylgmHJzkN7Vu5l10vXAPCc2xV1T4xYjZ+RSN9cV\nNryEuDS6+e/7Ihfo/Y7v/RDMuQKBgQDws/2gDFOUNk9tMjSB9DtmBlyK6k7YTiag\nUT7ENQIKX9JPXXbcUYNc2QAzdgmTvaHbwy1Ig8ounkzyO7pnLLLqCY0OlhkrouG8\nBle/47Ac7rnH6wXqHFANcvA3T04x8xH5SS0/jBOG6yqRlWNoZWFi3xRgqI7ErlZq\n73H/CQ9DPwKBgD6dAzKTyICq5s5JFCRXXbU2LB6QiteQEwXJbATkVrNGnghC8KPQ\np0FiR2qZLyr20w2UfSiKufPG8xFEWwyO/YZEmRZW9zr3J7O/4RSeQUhdLYIhuKRf\nkAFV8es0Bp8cZGVZ9Qd2PxXsQIjF0MmPp8/ZscGuwn3JzV4qVEVZ7ZfZAoGAbEM4\nr1T7/qzS2rV7Inxcfw4bb6vlnKrB+tewGIYTDeF9cY8DWCMdp5Q+3+aWdioT9Al8\ng6IrPP6cc1NkCuXy7wsus8HVPmg7idt8emWJn+nMC9xsw5jKdNIes3HrJNJEYlCE\nlpGFcuixM9vyY1E+FT9rJfKKjHIxklVye5hykfcCgYEAhNtSYQS4KG+3WDygq9aP\nzDw6v8cVfJ5FStPQ66Jusk15c9LhAgqcqAV1ODL2cIWThaMcnHcey74w5MK1oYEI\ngkrRePUoQGQv5gYXUtX9geZhAcSAauu44ewf0WqmqKxjd4Ohsp9jflC+WS5lpXJ5\n5eBmDsVBdmBjeaFEraGqwS0=\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-vr8fl@monitorme-fee8c.iam.gserviceaccount.com',
    client_id: '104220277304780341835',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vr8fl%40monitorme-fee8c.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://monitorme-fee8c.firebaseio.com'
  });

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
