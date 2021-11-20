import express from "express";
import { Pool } from "pg";

const app = express();

app.get("/users", (req, res) => {
  res
    .status(200)
    .json([
      {
        name: "León Grass",
        nSummaries: 1,
        avatar: "/src/assets/images/headphones.jpg",
      },
      { name: "Timo Stolz", nSummaries: 0 },
    ]);
});

app.listen(8080)