const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/authModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');

// register user - /api/v1/register
exports.register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password
    });

    sendToken(user, 201, 'Created Successfully', res)
})

//login user - /api/v1/login
exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    sendToken(user, 201,'Login Successfull', res)

})

// logout - /api/v1/logout
exports.logout = (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
        .status(200)
        .json({
            success: true,
            message: "Loggedout"
        })

};
