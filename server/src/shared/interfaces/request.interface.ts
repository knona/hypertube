import { Request as RequestExpress } from 'express';
import { JwtPayload } from 'src/modules/auth/jwt/jwt-payload';

export type Request = RequestExpress & { user: JwtPayload };
