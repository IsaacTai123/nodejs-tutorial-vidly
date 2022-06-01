const Joi = require("joi");
const express = require("express");
const app = express();
const genres = require("./routes/genres");

app.use(express.json());
app.use(express.urlencoded());
app.use("/api/genres", genres);

const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`Listening on port : ${port}`));
