const express = require("express");
const app = express();
const path = require("node:path");

const indexRouter = require('./routes/index')

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use('/', indexRouter)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

const PORT = process.env.PORT
app.listen(PORT);
