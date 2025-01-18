const fs = require('fs');
const path = require('path');
const multer = require('multer');

const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderType = req.folderType || 'default';
        const uploadDir = path.join(__dirname, '..', 'uploads', folderType);

        ensureDirExists(uploadDir);
        console.log('Upload directory:', uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueName}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileImage = /jpeg|jpg|png/;
    const extName = allowedFileImage.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileImage.test(file.mimetype);
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Hanya menerima file dengan format jpeg|jpg|png'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } 
});

// Middleware untuk mengatur jenis folder
const setUploadFolder = (folderType) => (req, res, next) => {
    req.folderType = folderType;
    next();
};

module.exports = { upload, setUploadFolder };
