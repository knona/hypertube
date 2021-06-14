import { applyDecorators } from '@nestjs/common';
import { Matches, MaxLength, MinLength } from 'class-validator';

export const IsPassword: PropertyDecorator = applyDecorators(
  MinLength(8),
  MaxLength(50),
  Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
);
