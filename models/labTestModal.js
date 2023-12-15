const mongoose = require('mongoose');
const validator = require('validator');

const labTestSchema = new mongoose.Schema({
    test_name : {
        type: String,
        required: [true, 'Please enter a lab test name']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

let model = mongoose.model('LabTest', labTestSchema);

module.exports = model;