const fs = require('fs');
const path = require('path');

class FileUtil {
    static deleteFile = (filePath) => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    };

    static generateFileUrl = (req, relativePath) => {
        const protocol = req.protocol;
        const host = req.get('host');
        return `${protocol}://${host}/${relativePath.replace(/\\/g, '/')}`;
    };

    static getRelativePath = (fullPath) => {
        const uploadsIndex = fullPath.indexOf('uploads');
        return uploadsIndex !== -1 ? fullPath.substring(uploadsIndex) : fullPath;
    };

    static validateFileExists = (filePath) => {
        return fs.existsSync(filePath);
    };

    static getFileSize = (filePath) => {
        try {
            const stats = fs.statSync(filePath);
            return stats.size;
        } catch (error) {
            return 0;
        }
    };

    static getFileExtension = (filename) => {
        return path.extname(filename).toLowerCase();
    };

    static isImageFile = (filename) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const extension = this.getFileExtension(filename);
        return imageExtensions.includes(extension);
    };

    static isPdfFile = (filename) => {
        const extension = this.getFileExtension(filename);
        return extension === '.pdf';
    };

    static createUploadDirectories = () => {
        const directories = [
            path.join(process.cwd(), 'uploads'),
            path.join(process.cwd(), 'uploads', 'images'),
            path.join(process.cwd(), 'uploads', 'documents')
        ];

        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    };
}

module.exports = FileUtil; 