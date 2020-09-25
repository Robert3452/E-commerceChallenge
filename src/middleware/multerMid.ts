import multer from 'multer';

const fileStorage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const uploadFile = multer({
    storage: fileStorage,
    limits: { fileSize: 1025 * 1024 * 5 }
});