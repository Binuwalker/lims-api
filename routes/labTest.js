const express = require('express');

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const { createLabTest, getLabTest } = require('../controllers/labTestController');

router.route('/labtest').get(getLabTest);
router.route('/admin/create').post(isAuthenticatedUser, authorizeRoles('admin'), createLabTest);


module.exports = router; 