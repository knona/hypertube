import { applyDecorators } from '@nestjs/common';
import { MaxLength, MinLength } from 'class-validator';

export const IsName: PropertyDecorator = applyDecorators(MinLength(1), MaxLength(50));
