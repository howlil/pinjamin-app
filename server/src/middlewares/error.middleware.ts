import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../configs/error";
import { logger } from "../configs/logger";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, {
    error: err,
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle AppError (custom error)
  if (err instanceof AppError) {
    const response = {
      status: "error",
      message: err.message,
    };

    // Add validation errors if available
    if (err instanceof ValidationError && Object.keys(err.errors).length > 0) {
      Object.assign(response, { errors: err.errors });
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationErrors = err.errors.reduce((acc, error) => {
      const field = error.path.join(".");
      acc[field] = error.message;
      return acc;
    }, {} as Record<string, string>);

    return res.status(400).json({
      status: "error",
      message: "Validasi gagal",
      errors: validationErrors,
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle unique constraint violations
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[]) || ["unknown"];
      return res.status(409).json({
        status: "error",
        message: `${field.join(", ")} sudah digunakan.`,
      });
    }

    // Handle foreign key constraint violations
    if (err.code === "P2003") {
      return res.status(400).json({
        status: "error",
        message: "Data terkait tidak ditemukan.",
      });
    }

    // Handle record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan.",
      });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: "error",
      message: "Validasi database gagal.",
    });
  }

  // Default error handler for unhandled errors
  console.error(err); // Log detailed error to console for debugging

  return res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
  });
};
