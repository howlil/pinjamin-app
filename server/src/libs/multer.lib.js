const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadDirs = {
    documents: path.join(__dirname, '../../uploads/documents'),
    images: path.join(__dirname, '../../uploads/images'),
    exports: path.join(__dirname, '../../uploads/exports')
};

Object.values(uploadDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirs.documents);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(file.originalname);
        const filename = `${timestamp}-${randomString}${extension}`;
        cb(null, filename);
    }
});

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirs.images);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(file.originalname);
        const filename = `${timestamp}-${randomString}${extension}`;
        cb(null, filename);
    }
});

const documentFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for documents'), false);
    }
};

const imageFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, PNG, and GIF files are allowed for images'), false);
    }
};

const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: documentFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
});

const uploadMultiple = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'proposalLetter') {
                cb(null, uploadDirs.documents);
            } else if (file.fieldname === 'buildingPhoto') {
                cb(null, uploadDirs.images);
            } else {
                cb(new Error('Unknown field name'), false);
            }
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const extension = path.extname(file.originalname);
            const filename = `${timestamp}-${randomString}${extension}`;
            cb(null, filename);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'proposalLetter') {
            documentFilter(req, file, cb);
        } else if (file.fieldname === 'buildingPhoto') {
            imageFilter(req, file, cb);
        } else {
            cb(new Error('Unknown field name'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const getFileUrl = (filename, type = 'documents') => {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${type}/${filename}`;
};

const deleteFile = (filepath) => {
    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

module.exports = {
    uploadDocument,
    uploadImage,
    uploadMultiple,
    getFileUrl,
    deleteFile,
    uploadDirs
}; 