const express = require("express");

const ReviewService = require("../services/reviewService");
const service = new ReviewService();
const reviewRouter = express.Router();

reviewRouter.get("/:id", async (req, res) => {
  const id = req.params.courseId;
  const response = await service.getReviewsByCourseId(id);

  console.log(response);
  res.send(response.responseBody());
});

module.exports = { reviewRouter };
