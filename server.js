//npm run dev runs nodemon
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


//Load env vars
dotenv.config({ path: './config/config.env'});

//Connect to dabase
connectDB();


//Route files
const  bootcamps = require('./routes/bootcamps');

const app = express();

//Body parser
app.use(express.json());



//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}



//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT =  process.env.PORT || 5000;


const server = app.listen(
    PORT, 
    console.log(`Server running on port ${process.env.NODE_ENV} mode on port ${PORT}`)
);


//Handle unhandle promise rejections. In case something happens to our connection to our database, we want to exit the app
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
})
