const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require('./router');


//Create express instance
const app = express();

// DB Setup
//Connect to mongodb
mongoose.connect('mongodb://localhost:auth/auth');

//App setup

app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);



//Server setup

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});