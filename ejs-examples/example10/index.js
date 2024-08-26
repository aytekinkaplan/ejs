import express from "express";
const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    page: "Home",
  });
});

app.get("/:page", (req, res) => {
  const page = req.params.page;
  res.render("index", { page: page });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
