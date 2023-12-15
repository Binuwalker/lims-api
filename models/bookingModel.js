const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    lab_test_id: {
        type: String,
        required: true,
    },
    patient_id: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    booking_date: {
        type: String,
        required: true,
    },
    time_slot: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: 'Confirmed'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

let model = mongoose.model('Booking', bookingSchema);

module.exports = model;