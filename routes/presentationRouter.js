import express from 'express';
const router = express.Router();
import presentationController from '../controllers/Presentation.js';
import multer from 'multer';
import authMiddleware from '../middleware/auth.js';
import { fileURLToPath } from 'url';
import { dirname,join} from 'path';
import fs from 'fs';
import path from 'path';

const uploadDir = '/home/keval/backend/uploads';

// Check if the directory exists, if not create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
 }
const storage = multer.diskStorage(
    {
    destination: function (req, file, cb) {
        cb(null, uploadDir);   
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original file name
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter,
});

router.post('/create', authMiddleware,upload.single('file'), presentationController.presentation_create);
// router.post('/create', authMiddleware, presentationController.presentation_create);
router.get('/pdf', (req, res) => {
    const { filename } = req.query;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = join(__dirname, '..', 'uploads', filename); // Move one level up to remove 'routes' from the path
    console.log('filePath:', filePath);
    res.status(200).json(filePath);
});


// Active presentation
router.post('/active', authMiddleware, presentationController.deactivatePresentation);

// get presentation for overseeuser
router.post('/getcompany',authMiddleware,presentationController.getcompanypresentation);


// get presentation
router.get('/getcompany',authMiddleware,presentationController.getcompanypresentation);

router.get('/single_presentation/:id', authMiddleware, presentationController.singlepresentation);


export default router;
