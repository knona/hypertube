import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { expirationTime } from './jwt/jwt.config';
import { JwtGuard } from './jwt/jwt.guard';
import { OAuth42Service } from './oauth-42/oauth-42.service';
import { OAuthGoogleService } from './oauth-google/oauth-google.service';

@Module({
  imports: [
    UserModule,
    EmailModule,
    JwtModule.register({
      secret: readFileSync('src/modules/auth/jwt/jwt-key.txt'),
      signOptions: { expiresIn: expirationTime }
    })
  ],
  providers: [
    AuthResolver,
    AuthService,
    UserService,
    OAuth42Service,
    OAuthGoogleService,
    { provide: APP_GUARD, useClass: JwtGuard }
  ],
  exports: [JwtModule]
})
export class AuthModule {}
