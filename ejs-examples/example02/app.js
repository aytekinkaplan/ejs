import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Express And EJS",
    message: "Hello World",
    littlemessage: "I am Aytekin Kaplan",
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
