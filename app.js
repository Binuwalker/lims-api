const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error')
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(cookieParser());
const auth = require('./routes/auth')
const labTest = require('./routes/labTest')
const booking = require('./routes/booking')
const timeSlot = require('./routes/timeSlot')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/v1/', auth);
app.use('/api/v1/', labTest);
app.use('/api/v1/', booking);
app.use('/api/v1/', timeSlot);

app.use(errorMiddleware)

module.exports = app;