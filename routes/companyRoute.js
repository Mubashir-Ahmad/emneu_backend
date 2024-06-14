import express from 'express';
const router = express.Router()
import CompanyController from '../controllers/CompanyContoller.js';
import authMiddleware from '../middleware/auth.js';

// company_create
router.post('/create',authMiddleware,CompanyController.company_create);

// company_get
router.get('/getcompany',authMiddleware,CompanyController.company_get);


// single_company_get
router.get('/getsinglecompany',authMiddleware,CompanyController.getsinglecompany);

// UPDATECOMPANY
router.put('/updatecompany',authMiddleware,CompanyController.updatecompany);

export default router;