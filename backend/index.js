const express = require("express");
const app = express();

// middleware
const helmet     = require("helmet");
const bodyParser = require("body-parser");

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/public'));
// ==========

// cloud functions
const { translate, speak, ocr, notFound } = require("./routes/index");

app.use("/translate", translate);
app.use("/speak", speak);
app.use("/ocr", ocr);
// ===============

// 404 page
app.use("/*", notFound);
// ========

app.listen("8080");