import express from "express";
const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    title: "EJS Examples",
    message: "Hello, World!",
    name: "Aytekin Kaplan",
    age: 30,
    date: new Date(),
    time: new Date().toLocaleTimeString(),
    now: new Date().toLocaleDateString(),
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About EJS Examples",
    message: "About Page - EJS Examples",
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// app.listen(3000);
