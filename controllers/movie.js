const { uuid } = require("uuidv4");
const { inference } = require("../huggingface");

const analysisModel = "cardiffnlp/twitter-roberta-base-sentiment-latest";
const movieReviews = {};

const newReviewObject = (reviewId, review, sentiment) => ({
  id: reviewId,
  text: review,
  time: Date.now(),
  sentiment,
  upvotes: 0,
  downvotes: 0,
});

exports.getAllReviews = (_req, res) => {
  try {
    // sending the reviews sorted according to the number of votes
    const sortedMovieReviews = Object.values(movieReviews).sort(
      (a, b) => b?.upvotes + b?.downvotes - (a?.upvotes + a?.downvotes)
    );
    return res.send({ reviews: sortedMovieReviews });
  } catch (e) {
    return res.status(500).send(e);
  }
};

exports.addMovieReview = async (req, res) => {
  try {
    const { review } = req.body;
    if (!review?.length) {
      return res.status(400).send("review not sent");
    }

    const reviewId = uuid();

    const analyseReview = await inference.textClassification({
      model: analysisModel,
      inputs: review,
    });
    const newReview = newReviewObject(reviewId, review, analyseReview[0].label);

    movieReviews[reviewId] = newReview;
    return res.send({ success: true, review: newReview });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

exports.upvoteOrDownvote = (req, res) => {
  try {
    const { action, reviewId } = req.body;

    if (!action?.length || !reviewId?.length) {
      return res.status(400).send("action or reviewId not sent");
    }

    if (!(action === "upvote" || action === "downvote")) {
      return res.status(400).send("invalid action type");
    }

    if (!movieReviews[reviewId]) {
      return res.status(404).send("no review of this reviewId exists");
    }

    const isActionUpvote = action === "upvote";
    movieReviews[reviewId] = {
      ...movieReviews[reviewId],
      [isActionUpvote ? "upvotes" : "downvotes"]: isActionUpvote
        ? movieReviews[reviewId].upvotes + 1
        : movieReviews[reviewId].downvotes + 1,
    };

    // sending the reviews sorted according to the number of votes
    const sortedMovieReviews = Object.values(movieReviews).sort(
      (a, b) => b?.upvotes + b?.downvotes - (a?.upvotes + a?.downvotes)
    );
    return res.send({ reviews: sortedMovieReviews, success: true });
  } catch (e) {
    return res.status(500).send(e);
  }
};
