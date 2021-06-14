import type { User } from '../Models/User';

export function fullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
