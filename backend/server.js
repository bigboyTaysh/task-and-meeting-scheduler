const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established succesfully');
});

const usersRouter = require('./routes/users');
//const eventsRouter = require('./routes/events');

app.use('/users', usersRouter);
//app.use('/events', eventsRouter);

app.use(session({
    key: 'username',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});