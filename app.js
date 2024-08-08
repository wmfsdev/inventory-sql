const express = require("express");
const app = express();
const path = require("node:path");


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


app.get("/", (req, res) => res.send("Hello, world!"));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`My first Express app - listening on port ${PORT}!`));
