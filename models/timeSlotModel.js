const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    time_slot_gap : {
        type: String,
        required: [true, 'Please enter a time slot gap']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

let model = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = model;