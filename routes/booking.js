const express = require('express');
const { submit, cancel, update, slots, getAppointments, updateMany } = require('../controllers/bookingController');

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.route('/submit/:id').post(submit);
router.route('/slots').get(slots);
router.route('/cancel/:id').delete(cancel);
router.route('/admin/update/:id').put(isAuthenticatedUser, authorizeRoles('admin'), update);
router.route('/admin/updatemany').put(
    // isAuthenticatedUser, authorizeRoles('admin'),
    updateMany);
router.route('/appointments').get(
    // isAuthenticatedUser, authorizeRoles('admin'), 
    getAppointments);


module.exports = router; 