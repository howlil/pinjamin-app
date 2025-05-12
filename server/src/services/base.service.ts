// server/src/services/base.service.ts
import { PrismaClient } from '@prisma/client';
import { prisma } from '../configs/db.config';
import { logger } from '../configs/logger.config';

export abstract class BaseService {
  protected prisma: PrismaClient;
  protected logger: typeof logger;
  protected serviceName: string;

  constructor(serviceName: string) {
    this.prisma = prisma;
    this.logger = logger;
    this.serviceName = serviceName;
  }

  // Helper method untuk logging
  protected logInfo(message: string, meta?: any): void {
    this.logger.info(`[${this.serviceName}] ${message}`, meta);
  }

  protected logError(message: string, error: any, meta?: any): void {
    this.logger.error(`[${this.serviceName}] ${message}`, { error, ...meta });
  }

  protected logWarn(message: string, meta?: any): void {
    this.logger.warn(`[${this.serviceName}] ${message}`, meta);
  }

  protected logDebug(message: string, meta?: any): void {
    this.logger.debug(`[${this.serviceName}] ${message}`, meta);
  }

  // Error handler
  protected handleError(error: any, context: string): void {
    this.logError(`Error in ${context}`, error);
    throw error;
  }

  // Transaction wrapper
  protected async executeTransaction<T>(
    callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => Promise<T>
  ): Promise<T> {
    try {
      return await this.prisma.$transaction(callback);
    } catch (error) {
      this.handleError(error, 'transaction');
      throw error;
    }
  }
}