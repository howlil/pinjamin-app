declare module "jsonwebtoken" {
  export interface JwtPayload {
    [key: string]: any;
    iat?: number;
    exp?: number;
  }

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string | Buffer,
    options?: SignOptions
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: VerifyOptions
  ): JwtPayload | string;

  export interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    subject?: string;
    issuer?: string;
    jwtid?: string;
    keyid?: string;
    noTimestamp?: boolean;
    header?: object;
    encoding?: string;
  }

  export interface VerifyOptions {
    algorithms?: string[];
    audience?: string | RegExp | Array<string | RegExp>;
    clockTimestamp?: number;
    clockTolerance?: number;
    complete?: boolean;
    issuer?: string | string[];
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    jwtid?: string;
    nonce?: string;
    subject?: string;
  }

  export class JsonWebTokenError extends Error {
    constructor(message: string);
  }

  export class TokenExpiredError extends JsonWebTokenError {
    expiredAt: Date;
    constructor(message: string, expiredAt: Date);
  }

  export class NotBeforeError extends JsonWebTokenError {
    date: Date;
    constructor(message: string, date: Date);
  }
}
