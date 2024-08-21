const express = require("express");
const app = express();

// Set EJS as the template engine
app.set("view engine", "ejs");

// Route for the home page
app.get("/", (req, res) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const advice = [
    "Relax and recharge for the week ahead.",
    "Start the week strong. Plan your tasks.",
    "Keep pushing forward. You're doing great!",
    "Mid-week grind! Stay focused.",
    "Almost there! Finish the week strong.",
    "Finish your work and enjoy the weekend!",
    "Take a break, you deserve it!",
  ];

  // Get the current day of the week
  const today = new Date().getDay();

  // Render the index.ejs file with the day and advice
  res.render("index", { day: days[today], advice: advice[today] });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
