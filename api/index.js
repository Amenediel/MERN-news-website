const express = require("express");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const authUser = require("./routes/user");
const authPost = require("./routes/posts");
const authCat = require("./routes/categories");
const { v4: uuidv4 } = require("uuid"); // Import uuid

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

mongoose
  .connect(process.env.CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB"); // Moved the log statement inside the 'then' block
  })
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    callback(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File uploaded");
});

app.use("/auth", authRoute);
app.use("/users", authUser);
app.use("/posts", authPost);
app.use("/categories", authCat);

app.listen("5000", () => {
  console.log("Server running on port 5000");
});
