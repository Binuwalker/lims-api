const catchAsyncError = require('../middlewares/catchAsyncError');
const TimeSlot = require('../models/timeSlotModel');

// admin create Time Slot - /api/v1/admin/create/timeslot
exports.createTimeSlot = catchAsyncError(async (req, res, next) => {
    const { time_slot_gap } = req.body;

    const timeSlot = await TimeSlot.create({
        time_slot_gap
    });

    res.status(200).json({
        success: true,
        message: "Time slot created successfully",
        timeSlot
    })
})

// admin create Time Slot - /api/v1/admin/update/timeslot/:id
exports.updateTimeSlot = catchAsyncError(async (req, res, next) => {
    const { time_slot_gap } = req.body;
    const newTimeSlot = {
        time_slot_gap
    }
    let timeSlot = await TimeSlot.findById(req.params.id);

    if (!timeSlot) {
        res.status(404).json({
            success: false,
            message: "Time slot not found"
        });
    }
    timeSlot = await TimeSlot.findByIdAndUpdate(req.params.id, newTimeSlot, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        timeSlot
    })
})