const express = require("express");
const app = express();

// middleware
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(process.cwd() + "/public"));
app.use(fileupload());
app.use(cors());
// ==========

// cloud functions
const { translate } = require("./routes/index");

app.use("/translate", translate);
// ===============

app.listen("8081");
