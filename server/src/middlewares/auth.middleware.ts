import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { authorizationService } from '../services/authorization.service';
import { UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError } from '../configs/error';
import { ROLE } from '@prisma/client';
import { logger } from '../configs/logger';

declare global {
  namespace Express {
    interface Request {
      pengguna?: any;
      token?: string;
    }
  }
}

/**
 * Authentication Middleware Builder
 * Menggunakan pattern builder untuk mempermudah pembuatan middleware auth
 */
export class AuthMiddlewareBuilder {
  private middlewareFunctions: Array<(req: Request, res: Response, next: NextFunction) => Promise<void>> = [];

  /**
   * Add authentication middleware
   */
  withAuthentication(): AuthMiddlewareBuilder {
    this.middlewareFunctions.push(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new UnauthorizedError('Tidak ada token autentikasi');
        }

        const token = authHeader.split(' ')[1];
        const pengguna = await authService.getPenggunaFromToken(token);

        // Set user and token in request object
        req.pengguna = pengguna;
        req.token = token;

        next();
      } catch (error) {
        logger.error('Authentication error', { error });
        next(error);
      }
    });

    return this;
  }

  /**
   * Add role-based authorization middleware
   */
  withRoleAuthorization(requiredRole: ROLE): AuthMiddlewareBuilder {
    this.middlewareFunctions.push(async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.pengguna) {
          throw new UnauthorizedError('Pengguna belum terautentikasi');
        }

        const isAuthorized = await authorizationService.hasRole(req.pengguna.role, requiredRole);
        if (!isAuthorized) {
          throw new ForbiddenError(`Akses ditolak. Anda tidak memiliki peran ${requiredRole}`);
        }

        next();
      } catch (error) {
        logger.error('Role authorization error', { error });
        next(error);
      }
    });

    return this;
  }

  /**
   * Add resource owner authorization middleware
   */
  withResourceOwnerAuthorization(
    paramIdField: string, 
    repository: any, 
    userIdField: string = 'pengguna_id'
  ): AuthMiddlewareBuilder {
    this.middlewareFunctions.push(async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.pengguna) {
          throw new UnauthorizedError('Pengguna belum terautentikasi');
        }

        const resourceId = req.params[paramIdField];
        if (!resourceId) {
          throw new BadRequestError(`Parameter ${paramIdField} tidak ditemukan`);
        }

        const isAuthorized = await authorizationService.isResourceOwner(
          req.pengguna.role,
          req.pengguna.id,
          resourceId,
          repository,
          userIdField
        );

        if (!isAuthorized) {
          throw new ForbiddenError('Akses ditolak. Anda tidak memiliki akses ke resource ini');
        }

        next();
      } catch (error) {
        logger.error('Resource owner authorization error', { error });
        next(error);
      }
    });

    return this;
  }

  /**
   * Build the middleware
   */
  build(): Array<(req: Request, res: Response, next: NextFunction) => Promise<void>> {
    if (this.middlewareFunctions.length === 0) {
      throw new Error('Middleware belum dibuat. Gunakan method "with..." untuk menambahkan middleware');
    }
    
    return this.middlewareFunctions;
  }
}

/**
 * Auth Middleware Factory
 * Pola factory untuk mempermudah pembuatan middleware auth
 */
export class AuthMiddlewareFactory {
  /**
   * Create authentication middleware
   */
  static createAuthenticationMiddleware() {
    return new AuthMiddlewareBuilder()
      .withAuthentication()
      .build();
  }

  /**
   * Create admin authorization middleware
   */
  static createAdminAuthorizationMiddleware() {
    return new AuthMiddlewareBuilder()
      .withAuthentication()
      .withRoleAuthorization(ROLE.ADMIN)
      .build();
  }

  /**
   * Create peminjam authorization middleware
   */
  static createPeminjamAuthorizationMiddleware() {
    return new AuthMiddlewareBuilder()
      .withAuthentication()
      .withRoleAuthorization(ROLE.PEMINJAM)
      .build();
  }

  /**
   * Create resource owner authorization middleware
   */
  static createResourceOwnerAuthorizationMiddleware(
    paramIdField: string,
    repository: any,
    userIdField: string = 'pengguna_id'
  ) {
    return new AuthMiddlewareBuilder()
      .withAuthentication()
      .withResourceOwnerAuthorization(paramIdField, repository, userIdField)
      .build();
  }
}

// Middleware function exports untuk kemudahan penggunaan
export const authenticate = AuthMiddlewareFactory.createAuthenticationMiddleware();
export const authorizeAdmin = AuthMiddlewareFactory.createAdminAuthorizationMiddleware();
export const authorizePeminjam = AuthMiddlewareFactory.createPeminjamAuthorizationMiddleware();

// Helper function untuk membuat resource owner authorization middleware
export function authorizeResourceOwner(paramIdField: string, repository: any, userIdField: string = 'pengguna_id') {
  return AuthMiddlewareFactory.createResourceOwnerAuthorizationMiddleware(paramIdField, repository, userIdField);
}