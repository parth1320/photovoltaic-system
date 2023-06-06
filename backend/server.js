const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/users");

const URI =
  "mongodb+srv://parthkakadiya320:parth1320@cluster0.wptpygu.mongodb.net/photovoltaic?retryWrites=true&w=majority";

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
