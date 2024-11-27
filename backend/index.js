require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const port = process.env.PORT || 3000;
connectDB()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cors({ 
    origin: ["https://ess-frontend-eight.vercel.app"],
    methods: ["GET", "POST","DELETE","PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded());

app.use('/', require('./routes/indexRoute'))

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is running on port ${port}`)
})