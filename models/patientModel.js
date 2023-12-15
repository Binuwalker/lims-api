const mongoose = require('mongoose');
const validator = require('validator');

const patientSchema = new mongoose.Schema({
    first_name : {
        type: String,
        required: [true, 'Please enter your first name']
    },
    last_name : {
        type: String,
        required: [true, 'Please enter your last name']
    },
    gender: {
        type: String,
        required: [true, 'Please enter your gender']
    },
    age: {
        type: String,
        required: [true, 'Please enter your age']
    },
    email:{
        type: String,
        required: [true, 'Please enter a email'],
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    phone_number: {
        type: String,
        required: [true, 'Please enter a phone number'],
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

let model = mongoose.model('Patient', patientSchema);

module.exports = model;