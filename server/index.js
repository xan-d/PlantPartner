const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const plantsRouter = require("./routes/plants")

// ROUTES
app.use("/", plantsRouter);

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
