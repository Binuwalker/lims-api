const catchAsyncError = require('../middlewares/catchAsyncError');
const LabTest = require('../models/labTestModal');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');

// get Lab Test - /api/v1/labtest

exports.getLabTest = catchAsyncError(async (req, res, next) => {
    const labTest = await LabTest.find();
    res.status(200).json({
        success: true,
        labTest
    })
})

// admin create Lab Test - /api/v1/admin/create
exports.createLabTest = catchAsyncError(async (req, res, next) => {
    const { test_name } = req.body;

    const labTest = await LabTest.create({
        test_name
    });

    res.status(200).json({
        success: true,
        message: "Test created successfully",
        labTest
    })
})