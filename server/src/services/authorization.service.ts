import { ROLE } from '@prisma/client';
import { logger } from '../configs/logger';

/**
 * Base Authorization Handler
 */
export abstract class BaseAuthorizationHandler {
  protected next: BaseAuthorizationHandler | null = null;

  /**
   * Set the next handler in the chain
   */
  setNext(handler: BaseAuthorizationHandler): BaseAuthorizationHandler {
    this.next = handler;
    return handler;
  }

  /**
   * Process authorization
   */
  async handle(userRole: ROLE, requiredRole: ROLE): Promise<boolean> {
    if (this.canHandle(userRole, requiredRole)) {
      return this.processAuthorization(userRole, requiredRole);
    }

    if (this.next) {
      return this.next.handle(userRole, requiredRole);
    }

    return false;
  }

  /**
   * Check if the handler can process this role
   */
  protected abstract canHandle(userRole: ROLE, requiredRole: ROLE): boolean;

  /**
   * Process the authorization
   */
  protected abstract processAuthorization(userRole: ROLE, requiredRole: ROLE): Promise<boolean>;
}

/**
 * Admin Authorization Handler
 */
export class AdminAuthorizationHandler extends BaseAuthorizationHandler {
  canHandle(userRole: ROLE, requiredRole: ROLE): boolean {
    return userRole === ROLE.ADMIN;
  }

  async processAuthorization(userRole: ROLE, requiredRole: ROLE): Promise<boolean> {
    // Admin has access to everything
    logger.debug('Admin authorization passed', { userRole, requiredRole });
    return true;
  }
}

/**
 * Peminjam Authorization Handler
 */
export class PeminjamAuthorizationHandler extends BaseAuthorizationHandler {
  canHandle(userRole: ROLE, requiredRole: ROLE): boolean {
    return userRole === ROLE.PEMINJAM;
  }

  async processAuthorization(userRole: ROLE, requiredRole: ROLE): Promise<boolean> {
    // Peminjam can only access peminjam resources
    if (requiredRole === ROLE.PEMINJAM) {
      logger.debug('Peminjam authorization passed', { userRole, requiredRole });
      return true;
    }
    
    logger.debug('Peminjam authorization failed', { userRole, requiredRole });
    return false;
  }
}

/**
 * Resource Owner Authorization Handler
 */
export class ResourceOwnerAuthorizationHandler extends BaseAuthorizationHandler {
  private repository: any;
  private resourceId: string;
  private userIdField: string;
  private userId: string;

  constructor(repository: any, resourceId: string, userIdField: string, userId: string) {
    super();
    this.repository = repository;
    this.resourceId = resourceId;
    this.userIdField = userIdField;
    this.userId = userId;
  }

  canHandle(userRole: ROLE, requiredRole: ROLE): boolean {
    // This handler is specific to resource ownership checks
    return true;
  }

  async processAuthorization(userRole: ROLE, requiredRole: ROLE): Promise<boolean> {
    try {
      // Admin bypass resource ownership check
      if (userRole === ROLE.ADMIN) {
        return true;
      }

      // Get the resource
      const resource = await this.repository.findById(this.resourceId);
      if (!resource) {
        return false;
      }

      // Check if user owns the resource
      const isOwner = resource[this.userIdField] === this.userId;
      
      logger.debug('Resource owner authorization', { 
        isOwner, 
        userRole, 
        resourceId: this.resourceId,
        userId: this.userId
      });
      
      return isOwner;
    } catch (error) {
      logger.error('Error in resource owner authorization', { error });
      return false;
    }
  }
}

/**
 * Authorization Service
 */
export class AuthorizationService {
  /**
   * Check if user has required role
   */
  async hasRole(userRole: ROLE, requiredRole: ROLE): Promise<boolean> {
    const adminHandler = new AdminAuthorizationHandler();
    const peminjamHandler = new PeminjamAuthorizationHandler();
    
    // Set up chain of responsibility
    adminHandler.setNext(peminjamHandler);
    
    return adminHandler.handle(userRole, requiredRole);
  }

  /**
   * Check if user owns the resource
   */
  async isResourceOwner(
    userRole: ROLE, 
    userId: string, 
    resourceId: string, 
    repository: any, 
    userIdField: string = 'pengguna_id'
  ): Promise<boolean> {
    const resourceOwnerHandler = new ResourceOwnerAuthorizationHandler(
      repository, 
      resourceId, 
      userIdField, 
      userId
    );
    
    const adminHandler = new AdminAuthorizationHandler();
    
    // Admin can access any resource
    if (userRole === ROLE.ADMIN) {
      return adminHandler.handle(userRole, ROLE.ADMIN);
    }
    
    return resourceOwnerHandler.handle(userRole, ROLE.PEMINJAM);
  }
}

export const authorizationService = new AuthorizationService();