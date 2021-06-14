import { applyDecorators } from '@nestjs/common';
import { Matches, MaxLength, MinLength } from 'class-validator';

export const IsUsername: PropertyDecorator = applyDecorators(MinLength(3), MaxLength(25), Matches(/^[a-zA-Z0-9_]+$/));
