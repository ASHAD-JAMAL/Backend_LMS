require("dotenv").config();

const express = require("express");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
const {dbConnection} = require("./configs/db");


const {MONGO_URL,PORT} = process.env;

const app = express();

// connection to the database
dbConnection(MONGO_URL);

const port = PORT || 5000;

app.listen(port,() =>{
    console.log(`The app is running on http://localhost:${port}`);
});