require("dotenv").config()
const express = require("express");
const createError = require("http-errors");
const PORT =   process.env.PORT || 8081;
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");


// the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
mongoose.set('strictQuery', true)

// database connected
mongoose.connect(process.env.MONGO_URI,(err)=>{
    console.log(`conntect to Database: ${ err ? "false due to " + err : "true" }`)
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(logger('dev'));


// * Routes * // 
app.use("/api/users", require("./routes/user") );
app.use("/api/cards", require("./routes/card"));

app.get('/',(req,res)=>{
    res.send(`<h1>Hello From Backend ( server side )</h1>`);
});

// * Handle Errors * //
app.use(function (req, res, next) {
    next(createError(404));
});

app.listen(PORT, (error) => {
    console.log(error
        ? `Error occurred, server can't start ${error}`
        : `Server is Successfully Running,  and App is listening on port ${PORT}`
    )
})