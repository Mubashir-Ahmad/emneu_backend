import express from 'express'
import authMiddleware from '../middleware/auth.js'
import paymentController from '../controllers/paymentController.js'
const router = express.Router()



// payment process processed
router.post('/payment/process',authMiddleware, paymentController.processpayment)

// get stripe api key
router.get('/stripekey', paymentController.sendstripkey)

// payment infomation saved
router.post('/paymentinfosave',authMiddleware,paymentController.paymentinfosave)

// Get all payment information
router.get('/allpayment',authMiddleware,paymentController.getpaymentinfo);

// Get all payment information for oversee user
router.post('/allpayment',authMiddleware,paymentController.getpaymentinfo);
// get single payment information
router.get('/singlepayment',authMiddleware,paymentController.getsinglepayment);

// create ach payment 
router.post('/achpayment',authMiddleware,paymentController.achpayment);

// deactive payment
router.post('/deactivepayment',paymentController.deactivepayment);

// delete payment
router.delete('/deletepayment',paymentController.removepayment);
export default router
