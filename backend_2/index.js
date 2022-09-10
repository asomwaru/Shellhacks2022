const express = require("express");
const app = express();

// middleware
const helmet     = require("helmet");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/public'));
app.use(fileupload());
// ==========

// cloud functions
const { translate, speak, ocr, notFound } = require("./routes/index");

app.use("/translate", translate);
// ===============

// 404 page
app.use("/*", notFound);
// ========

app.listen("8080");