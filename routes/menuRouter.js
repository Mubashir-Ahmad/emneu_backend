import express from 'express';
import menuController from '../controllers/menus.js'
import authMiddleware from '../middleware/auth.js';
const router = express.Router()
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, "user_" + Date.now() + file.mimetype.split('image/').join('.'));
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
});

router.post('/',authMiddleware,menuController.addMenu);
// get all menu for comapny
router.get('/getall',authMiddleware,authMiddleware,menuController.getMenu);

// get all menu for oversee user
router.post('/getall',authMiddleware,authMiddleware,menuController.getMenu);

router.get('/single_menu/:id',authMiddleware,menuController.getSingleMenu);

// delete single menu
router.delete('/single_menu_delete/:id',authMiddleware,menuController.deleteMenu);

// update menu
router.put("/updatemenu/:id",authMiddleware,menuController.updateMenu)

// filter menu
router.get('/filtermenu',authMiddleware,menuController.filtermenu);

export default router;
