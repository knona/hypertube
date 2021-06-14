import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Token } from 'src/graphql';
import { AuthService } from '../auth/auth.service';
import { UserDocument, UserModel } from '../user/schema/user.schema';
import { CurrentUser } from './current-user.decorator';
import { GenerateEmailUpdateTokenDto } from './dto/generate-email-update-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './jwt/jwt-payload';
import { OAuth42Service } from './oauth-42/oauth-42.service';
import { OAuthGoogleService } from './oauth-google/oauth-google.service';
import { Public } from './public.decorator';

@Resolver('Auth')
export class AuthResolver {
  public constructor(
    private readonly authService: AuthService,
    private readonly oauth42Service: OAuth42Service,
    private readonly oauthGoogleService: OAuthGoogleService
  ) {}

  @Mutation()
  @Public()
  public async register(@Args('user') registerDto: RegisterDto): Promise<void> {
    await this.authService.register(registerDto);
  }

  @Mutation()
  @Public()
  public login(@Args('credentials') loginDto: LoginDto): Promise<{ token: Token; user: UserDocument }> {
    return this.authService.login(loginDto);
  }

  @Mutation()
  @Public()
  public login42(@Args('code') code: string): Promise<{ token: Token; user: UserDocument }> {
    return this.oauth42Service.login(code);
  }

  @Mutation()
  @Public()
  public loginGoogle(@Args('code') code: string): Promise<{ token: Token; user: UserDocument }> {
    return this.oauthGoogleService.login(code);
  }

  @Mutation()
  public refresh(@CurrentUser() user: JwtPayload): Promise<Token> {
    return this.authService.refresh(user);
  }

  @Mutation()
  @Public()
  public generateVerificationToken(@Args('email') email: string): Promise<void> {
    return this.authService.generateVerificationToken(email);
  }

  @Mutation()
  @Public()
  public verify(
    @Args('username') username: string,
    @Args('token') token: string
  ): Promise<{ token: Token; user: UserDocument }> {
    return this.authService.verify(username, token);
  }

  @Mutation()
  @Public()
  public generateResetPasswordToken(@Args('email') email: string): Promise<void> {
    return this.authService.generateResetPasswordToken(email);
  }

  @Mutation()
  @Public()
  public resetPassword(@Args() dto: ResetPasswordDto): Promise<{ token: Token; user: UserDocument }> {
    return this.authService.resetPassword(dto);
  }

  @Mutation()
  public generateEmailUpdateToken(
    @Args() dto: GenerateEmailUpdateTokenDto,
    @CurrentUser() user: JwtPayload
  ): Promise<void> {
    return this.authService.generateEmailUpdateToken(dto.email, user);
  }

  @Mutation()
  @Public()
  public updateEmail(@Args('username') username: string, @Args('token') token: string): Promise<UserModel> {
    return this.authService.updateEmail(username, token);
  }
}
