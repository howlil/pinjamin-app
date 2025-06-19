const multer = require('multer');
const path = require('path');
const fs = require('fs');

class MulterConfig {
    _createUploadDir = (dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    };

    _generateFileName = (originalname) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(originalname);
        return `${timestamp}-${randomString}${extension}`;
    };

    _imageStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(process.cwd(), 'uploads', 'images');
            this._createUploadDir(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const fileName = this._generateFileName(file.originalname);
            cb(null, fileName);
        }
    });

    _pdfStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(process.cwd(), 'uploads', 'documents');
            this._createUploadDir(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const fileName = this._generateFileName(file.originalname);
            cb(null, fileName);
        }
    });

    _imageFileFilter = (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp'
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed'), false);
        }
    };

    _pdfFileFilter = (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    };

    get imageUpload() {
        return multer({
            storage: this._imageStorage,
            fileFilter: this._imageFileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
                files: 1
            }
        }).single('image');
    }

    get pdfUpload() {
        return multer({
            storage: this._pdfStorage,
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
                files: 1
            }
        }).single('document');
    }

    get proposalUpload() {
        return multer({
            storage: this._pdfStorage,
            fileFilter: this._pdfFileFilter,
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
                files: 1
            }
        }).single('proposalLetter');
    }
}

module.exports = new MulterConfig(); 