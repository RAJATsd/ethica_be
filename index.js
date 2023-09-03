require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  getAllReviews,
  addMovieReview,
  upvoteOrDownvote,
} = require("./controllers/movie");

const app = express();
const API_PORT = process.env.PORT || "3001";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send({ success: true });
});

app.get("/reviews", getAllReviews);

app.post("/review", addMovieReview);

app.put("/review/vote", upvoteOrDownvote);

app.listen(API_PORT, () => console.log("Connected to 3001"));
