const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const httpError = require('./models/http-error');
const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');
const client = require('./models/db');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use((req, res, next) => {
    const error = new httpError('Could not find this route', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error); // if error has already been sent to the client, pass it on to the next middleware
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
}) // error handling middleware

client.connect().then(() => {
    app.listen(port, () => {
        console.log(`connected to customs broker database and listening on port ${port}`);
    });
}).catch(err => console.log(err));
