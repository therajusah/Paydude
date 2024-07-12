const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes");

// const v2Router = require("./v2Routes"); 

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use(router);

router.get("/", function (req, res, next) {
  console.log("Hello");
  res.send("Hello");
});

router.use("/api/v1", mainRouter);


// router.use("/api/v2", v2Router);

app.listen(PORT, function (err) {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log("Server running on port", PORT);
  }
});
