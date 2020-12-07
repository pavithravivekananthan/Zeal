const express = require('express');
const connectDb = require('./config/db');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const userRoutes = require('./routes/user');
const app = express();

connectDb();


app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/seller', itemRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
    console.log(error + '--------------------------');
    const statusCode = error.statusCode || 500;
    const message = error.message;
    let errorsPresent;
    if (error.errors) {
        errorsPresent = error.errors;
    }

    res.status(statusCode).json({
        message: message,
        errors: errorsPresent,
    });
});

app.listen(5000, () => { console.log('Port is lisenting at 5000') })