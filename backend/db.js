const mongoose = require("mongoose");
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const userSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
