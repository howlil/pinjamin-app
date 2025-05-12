// server/src/controllers/base.controller.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../configs/logger.config";

export interface IController {
  index?(req: Request, res: Response, next: NextFunction): Promise<void>;
  create?(req: Request, res: Response, next: NextFunction): Promise<void>;
  update?(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete?(req: Request, res: Response, next: NextFunction): Promise<void>;
  show?(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export abstract class BaseController implements IController {
  protected logger: typeof logger;
  protected serviceName: string;

  constructor(serviceName: string) {
    this.logger = logger;
    this.serviceName = serviceName;
  }

  // Helper method untuk response standard
  protected sendResponse(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data: any = null
  ): void {
    res.status(statusCode).json({
      success,
      message,
      data
    });
  }

  // Helper method untuk success response
  protected sendSuccess(
    res: Response,
    message: string,
    data: any = null,
    statusCode: number = 200
  ): void {
    this.sendResponse(res, statusCode, true, message, data);
  }

  // Helper method untuk error response
  protected sendError(
    res: Response,
    message: string,
    statusCode: number = 400
  ): void {
    this.sendResponse(res, statusCode, false, message, null);
  }

  // Helper method untuk logging
  protected logInfo(message: string, meta?: any): void {
    this.logger.info(`[${this.serviceName}] ${message}`, meta);
  }

  protected logError(message: string, error: any): void {
    this.logger.error(`[${this.serviceName}] ${message}`, { error });
  }

  index?(req: Request, res: Response, next: NextFunction): Promise<void>;
  create?(req: Request, res: Response, next: NextFunction): Promise<void>;
  update?(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete?(req: Request, res: Response, next: NextFunction): Promise<void>;
  show?(req: Request, res: Response, next: NextFunction): Promise<void>;
}