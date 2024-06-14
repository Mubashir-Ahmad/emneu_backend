import express from 'express';
const router = express.Router()
import supportController from '../controllers/SupportController.js';
import authMiddleware from '../middleware/auth.js';

// create support
router.post('/create',authMiddleware,supportController.createsupport);

// getsupport
router.get('/getsupport',authMiddleware,supportController.getsupport);

// getsupportSingle
router.get('/getsinglesupport/:id',authMiddleware,supportController.getsinglesupport);

// getsupportUpdate
router.get('/supportupdate/:id',authMiddleware,supportController.supportupdate);




export default router
