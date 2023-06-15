
import Jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@/config';
import { Types } from 'mongoose';


class JwtService {
    public static sign(payload: JwtPayload | string, secret: Jwt.Secret = JWT_SECRET, expiry: string = '10m'): string {
        return Jwt.sign(payload, secret, { expiresIn: expiry });
    }

    public static verify(token: string, secret: Jwt.Secret = JWT_SECRET): string | JwtPayload {
        return Jwt.verify(token, secret)
    }
}


export default JwtService;