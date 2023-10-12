const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 5000;

//cookie-parser
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

require('./config/database').connect();

//mounting a route
const user = require('./routes/user')
app.use('/api/v1',user);


app.listen(PORT,()=>{
    console.log(`App is Running on a ${PORT}`)
})

