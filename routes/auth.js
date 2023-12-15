const express = require('express');
const multer = require('multer');
const path = require('path');

const upload = multer({
        storage: multer.diskStorage({
                destination: function (req, file, cb) {
                        cb(null, path.join(__dirname, '..', 'uploads/user'))
                },
                filename: function (req, file, cb) {
                        cb(null, file.originalname)
                }
        })
})

const { register,
        login,
        logout } = require('../controllers/authController');
const router = express.Router();
// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);


module.exports = router; 