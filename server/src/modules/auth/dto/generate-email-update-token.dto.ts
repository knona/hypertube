import { IsEmail } from 'class-validator';

export class GenerateEmailUpdateTokenDto {
  @IsEmail()
  public email: string;
}
