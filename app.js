const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = "innocent98";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let confessions = [];
let uploadedImage = "/uploads/default.jpg";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "school_photo" + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index", { uploadedImage });
});

app.post("/submit", (req, res) => {
  const { confession, name } = req.body;
  if (confession) {
    confessions.unshift({ confession, name: name || "Anonymous" });
  }
  res.redirect("/");
});

app.get("/admin", (req, res) => {
  res.render("admin_login");
});

app.post("/admin", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.render("admin", { confessions, uploadedImage });
  } else {
    res.send("Incorrect password");
  }
});

app.post("/upload-photo", upload.single("schoolPhoto"), (req, res) => {
  uploadedImage = "/uploads/" + req.file.filename;
  res.redirect("/admin");
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
