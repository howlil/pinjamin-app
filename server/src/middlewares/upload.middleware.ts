// src/middlewares/upload.middleware.ts
import { Request, Response, NextFunction } from 'express';
import multer from 'multer'
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../configs/error.config';

class UploadMiddleware {
  private storage: multer.StorageEngine;
  private upload: multer.Multer;
  private uploadPath: string;

  constructor() {
    this.uploadPath = path.join(process.cwd(), 'public/uploads/');
    
    this.ensureUploadDirExists();
    
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadPath);
      },
      filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;
        cb(null, fileName);
      }
    });

    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024 
      }
    });
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  private fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ): void => {
    const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
    const extname = path.extname(file.originalname).toLowerCase();
    
    if (allowedFileTypes.includes(extname)) {
      callback(null, true);
    } else {
      callback(new Error('Format file tidak didukung. Hanya JPG, JPEG, atau PNG yang diizinkan.'));
    }
  };

  uploadSingle = (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const singleUpload = this.upload.single(fieldName);
      
      singleUpload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new BadRequestError('Ukuran file terlalu besar. Maksimum 5MB diperbolehkan.'));
          }
          return next(new BadRequestError(`Error upload file: ${err.message}`));
        } else if (err) {
          return next(new BadRequestError(err.message));
        }

        if (req.file) {
        
          req.body.foto_gedung = `${req.file.filename}`;
        }
        
        next();
      });
    };
  };

  // Middleware for multiple file upload
  uploadMultiple = (fieldName: string, maxCount: number = 5) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const multipleUpload = this.upload.array(fieldName, maxCount);
      
      multipleUpload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new BadRequestError('Ukuran file terlalu besar. Maksimum 5MB diperbolehkan.'));
          } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new BadRequestError(`Maksimum ${maxCount} file diperbolehkan.`));
          }
          return next(new BadRequestError(`Error upload file: ${err.message}`));
        } else if (err) {
          return next(new BadRequestError(err.message));
        }

        if (req.files && Array.isArray(req.files)) {
          req.body[fieldName] = (req.files as Express.Multer.File[]).map(
            file => `/uploads/${file.filename}`
          );
        }
        
        next();
      });
    };
  };
}

export default new UploadMiddleware();