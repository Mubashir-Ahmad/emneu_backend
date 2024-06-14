import express from 'express';
const router = express.Router()
import userController from '../controllers/users.js';
import authMiddleware from '../middleware/auth.js';
import SendemailContoroller from '../controllers/email.js';
// Register user
router.post('/signup',authMiddleware,userController.signup);

// Login
router.post('/login',userController.login);

// Email send
router.post('/',SendemailContoroller.sendmail);

// LoadUser
router.get('/load_user',authMiddleware,userController.loaduser);

// get all user of single company
router.get('/getallusersinglecompany',authMiddleware,userController.getallusercompany);

router.post('/getallusersinglecompany',authMiddleware,userController.getallusercompany);

// ResetPassword
router.put('/password/reset' ,userController.resetpassword);

// confirmPassword
router.put('/password/update/:token', userController.updatepassword);

// acitve or deactive
router.post('/active', authMiddleware, userController.deactivateuser);

//Owner acitve or deactive
router.post('/owneractive', authMiddleware, userController.ownercompanydeactivateuser);
// get single User
router.get('/getsingleuser',userController.getsingleuser);


// get single User
router.post('/registeruserpassword',userController.registeruserpassword);


// get all user of owner company
router.get('/getonwerusers',authMiddleware,userController.getallownercompany);


// Saved register
router.post('/saveuserpassword/:token',userController.savedpassword);

// Oversee user
router.post('/api/selectCompanyAndRedirect',userController.overseeuser);

// update_user
router.put('/updateuser',authMiddleware,userController.updateuser)


export default router;