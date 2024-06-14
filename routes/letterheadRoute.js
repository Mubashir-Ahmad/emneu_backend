import express from 'express';
const router = express.Router()
import letterheadController from '../controllers/LetterheadController.js';
import authMiddleware from '../middleware/auth.js';

router.post('/create',authMiddleware,letterheadController.company_letterhead);

router.post('/createtext',authMiddleware,letterheadController.company_letterhead_Text);

// get overseeuser letterhead
router.post('/getletterhead',authMiddleware,letterheadController.get_letterhead);

// get letterhead
router.get('/getletterhead',authMiddleware,letterheadController.get_letterhead);


export default router;