import { UserInputError } from 'apollo-server-errors';
import { ValidationError } from 'class-validator';
import { E_VALIDATION } from './errors.util';

export function exceptionFactory(validationErrors: ValidationError[]): UserInputError {
  const errors: string[] = validationErrors.reduce((acc, curr) => [...acc, ...Object.values(curr.constraints)], []);
  return new UserInputError('Invalid user input', { errors, subCode: E_VALIDATION });
}
