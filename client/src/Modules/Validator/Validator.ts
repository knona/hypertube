import type { Validator } from '../../Shared/Types';
import { ValidatorError } from '../../UI/Components/TextFieldValidator/Models/ValidatorError';

const username: Validator = (stringValue: string) => {
  if (stringValue.length < 3 || stringValue.length > 25) {
    throw ValidatorError.invalidUsernameLength;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(stringValue)) {
    throw ValidatorError.invalidUsernameCharacters;
  }
};

const name: Validator = (stringValue: string) => {
  if (stringValue.length < 1 || stringValue.length > 50) {
    throw ValidatorError.invalidNameLength;
  }
};

const password: Validator = (stringValue: string) => {
  if (stringValue.length < 8 || stringValue.length > 50) {
    throw ValidatorError.invalidPasswordLength;
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(stringValue)) {
    throw ValidatorError.invalidPasswordCharacters;
  }
};

const email: Validator = (stringValue: string) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(stringValue)) {
    throw ValidatorError.invalidEmail;
  }
};

export default {
  username,
  name,
  password,
  email
};
