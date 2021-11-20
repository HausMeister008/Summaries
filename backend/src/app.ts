import express from "express";
import { Pool } from "pg";

// https://node-postgres.com/

const app = express();

app.get("/api/users", (req, res) => {
  const { usernameStartsWith } = req.query
  console.log('usernameStartsWith', usernameStartsWith)
  res
    .status(200)
    .json([
      {
        name: "León Grass",
        nSummaries: 1,
        avatar: "/src/assets/images/headphones.jpg",
      },
      { name: "Timo Stolz", nSummaries: 0 },
      { name: "Tina", nSummaries: 0 }
    ]);
});

const server = app.listen(8080, () => {
  console.log('opened server on', server.address());
})