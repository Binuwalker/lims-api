const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const { createTimeSlot, updateTimeSlot } = require('../controllers/timeSlotController');

router.route('/admin/create/timeslot').post(createTimeSlot);
router.route('/admin/update/timeslot/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateTimeSlot);


module.exports = router; 