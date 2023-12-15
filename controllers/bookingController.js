const catchAsyncError = require('../middlewares/catchAsyncError');
const Patient = require('../models/patientModel');
const Booking = require('../models/bookingModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/email');

// submit - /api/v1/submit
exports.submit = catchAsyncError(async (req, res, next) => {
    const { first_name, last_name, gender, age, email, phone_number, booking_date, time_slot } = req.body;

    const booking_dates = await Booking.aggregate([
        {
            $unwind: "$booking_date",
        },
        {
            $group: {
                _id: {
                    booking_date: "$booking_date",
                    time_slot: "$time_slot", // Include the time_slot field
                    status: "$status"
                },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                booking_date: "$_id.booking_date", // Rename the fields if needed
                time_slot: "$_id.time_slot",
                status: "$_id.status",
                count: 1,
            },
        },
    ]);

    const formattedDates = booking_dates.map(({ booking_date, time_slot, status }) => ({
        booking_date: `${booking_date}`,
        time_slot: `${time_slot}`,
        status: `${status}`,
    }));

    let existingTestRecords = [];

    Booking.find({ lab_test_id: req.params.id }, (err, results) => {
        if (err) {
            console.error('Error finding records:', err);
            return;
        }

        existingTestRecords = results;
    });

    if (formattedDates.find(date => date.booking_date === booking_date && date.time_slot === time_slot && date.status === 'Confirmed')) {
        return next(new ErrorHandler('Time slot is already booked for this date', 400));
    }


    const existingPatient = await Patient.findOne({ email });

    const patient = {
        first_name,
        last_name,
        gender,
        age,
        email,
        phone_number,
    };

    let patient_id = null;

    if (!existingPatient) {
        patient_id = await Patient.create({
            first_name,
            last_name,
            gender,
            age,
            email,
            phone_number,
        });
    }

    if (existingTestRecords.find(data => data?.patient_id === existingPatient?._id?.toString()) || existingTestRecords.find(data => data?.patient_id ===  patient_id?._id?.toString())) {
        return next(new ErrorHandler('Test is already booked', 400));
    }

    const booking = await Booking.create({
        lab_test_id: req.params.id,
        patient_id: patient_id?._id ? patient_id._id.toString() : existingPatient._id.toString(),
        first_name,
        last_name,
        booking_date,
        time_slot
    })

    const cancelId = booking._id.toString();

    const cancelURL = `${process.env.CLIENT_URL}/cancel?id=${cancelId}`;

    const message = `
    <div style="display: flex; align-items: center; justify-content: center; background: rgb(231, 231, 231); border-radius: 10px;">
        <div style="margin: 25px;margin-top: 20px; margin-bottom: 20px">
            <div style="color: #000; font-size: 20px; font-weight: 600; margin-top: 10px; margin-bottom: 10px">
                Your appointment is confirmed. We see you on ${booking_date} at ${time_slot}.
            </div>
            <div style="color: #000; font-size: 20px; margin-top: 10px; margin-bottom: 10px">
                If you want to cancel the appointment
                <a href="${cancelURL}" style="text-decoration: none; font-weight: 600;">Click here</a>
            </div>
        </div>
    </div>
    `

    sendEmail({
        email,
        subject: 'Appointment Confirmed',
        message,
    })

    res.status(200).json({
        success: true,
        message: "Application submitted successfully",
        booking,
        patient: existingPatient ? existingPatient : patient
    })
})

// slots - /api/v1/slots
exports.slots = catchAsyncError(async (req, res, next) => {
    const booking_dates = await Booking.aggregate([
        {
            $unwind: "$booking_date",
        },
        {
            $group: {
                _id: {
                    booking_date: "$booking_date",
                    time_slot: "$time_slot", // Include the time_slot field
                    status: "$status"
                },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                booking_date: "$_id.booking_date", // Rename the fields if needed
                time_slot: "$_id.time_slot",
                status: "$_id.status",
                count: 1,
            },
        },
    ]);

    const formattedSlots = booking_dates.map(({ booking_date, time_slot, status }) => ({
        booking_date: `${booking_date}`,
        time_slot: `${time_slot}`,
        status: `${status}`
    }));

    res.status(200).json({
        success: true,
        formattedSlots
    })
})

// cancel - /api/v1/cancel
exports.cancel = catchAsyncError(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }

    function isOneDayOrMoreBefore(bookingDate, timeSlot) {
        const currentDate = new Date();
        const [bookingMonth, bookingDay, bookingYear] = bookingDate.split('-').map(Number);
        const [bookingHour, bookingMinute] = timeSlot.split(':').map(Number);

        const bookingDateTime = new Date(bookingYear, bookingMonth - 1, bookingDay, bookingHour, bookingMinute);
        const timeDifference = bookingDateTime - currentDate;
        const daysDifference = timeDifference / (24 * 60 * 60 * 1000);

        return daysDifference >= 1;
    }

    const isBeforeOneDayOrMore = isOneDayOrMoreBefore(booking.booking_date, booking.time_slot);

    if (!isBeforeOneDayOrMore) {
        return next(new ErrorHandler('Sorry you have crossed the time limit for cancelation', 400));
    }

    // await booking.remove();

    res.status(200).json({
        success: true,
        message: "Booking canceled successfully!"
    })
})

// admin update - /api/v1/admin/update
exports.update = catchAsyncError(async (req, res, next) => {
    const { status } = req.body;
    const newBooking = {
        status
    }
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404).json({
            success: false,
            message: "Application not found"
        });
    }
    booking = await Booking.findByIdAndUpdate(req.params.id, newBooking, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        booking
    })
})

// admin updateMany - /api/v1/admin/updatemany
exports.updateMany = catchAsyncError(async (req, res, next) => {
    const { startDate, endDate, startTime, endTime, status } = req.body;
    const newBooking = {
        status
    };

    // Find and update all records within the specified date range and time range
    const updatedBookings = await Booking.updateMany(
        {
            booking_date: {
                $gte: startDate, // Greater than or equal to startDate
                $lte: endDate    // Less than or equal to endDate
            },
            time_slot: {
                $gte: startTime, // Greater than or equal to startTime
                $lte: endTime    // Less than or equal to endTime
            }
        },
        { $set: newBooking }, // Update status to the new value
        { new: true, runValidators: true } // Options for the update operation
    );

    // Check if any records were modified
    if (updatedBookings.nModified === 0) {
        return res.status(404).json({
            success: false,
            message: "No bookings found for the specified date and time range."
        });
    }

    const appointments = await Booking.find();

    res.status(200).json({
        success: true,
        message: "Bookings updated successfully",
        updatedBookings,
        appointments
    });
});

// get Appointments - /api/v1/appointments

exports.getAppointments = catchAsyncError(async (req, res, next) => {
    const appointments = await Booking.find();
    res.status(200).json({
        success: true,
        appointments
    })
})