// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { APP_CONFIG } from "../configs/app.config";
import { UnauthorizedError, ForbiddenError } from "../configs/error.config";
import { prisma } from "../configs/db.configs";
import { ROLE } from "@prisma/client";

interface DecodedToken {
  id: string;
  role: ROLE;
  email: string;
}

export class AuthMiddleware {
  static authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Token tidak tersedia");
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(
          token,
          APP_CONFIG.JWT_SECRET
        ) as DecodedToken;

        // Cek apakah token ada di database
        const userToken = await prisma.token.findFirst({
          where: {
            token,
            pengguna_id: decoded.id,
          },
        });

        if (!userToken) {
          throw new UnauthorizedError("Token tidak valid");
        }

        // Set user pada request object
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };

        next();
      } catch (jwtError) {
        throw new UnauthorizedError("Token tidak valid");
      }
    } catch (error) {
      next(error);
    }
  };

  static authorize = (role: ROLE) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new UnauthorizedError("Autentikasi diperlukan");
        }

        if (req.user.role !== role) {
          throw new ForbiddenError("Tidak memiliki akses");
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  static authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    return AuthMiddleware.authorize(ROLE.ADMIN)(req, res, next);
  };

  static authorizePeminjam = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return AuthMiddleware.authorize(ROLE.PEMINJAM)(req, res, next);
  };
}
