const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
//for autolading of routes
const {readdirSync}=require('fs');
require("dotenv").config();

// express server to the app
const app = express();

// database
  mongoose.connect( process.env.DATABASE || process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true ,
    useFindAndModify: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));
// middlewares 
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "3mb" })); //if client is sending data bigger than 3mb there will be eror
app.use(cors());

// port
const port = process.env.PORT || 8000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build')); 
}

//for autolading of routes
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

app.listen(port, () => console.log(`Server is running on port ${port}`));