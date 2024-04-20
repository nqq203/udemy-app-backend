const express = require("express");

const ReviewService = require("../services/reviewService");
const service = new ReviewService();
const reviewRouter = express.Router();

// update?ci=661f3da7f99f882605188c82&ui=6600feb4be517cbbf9172379
reviewRouter.get("/update", async (req, res) => {
  const courseId = req.query.ci || "";
  const userId = req.query.ui || "";

  const response = await service.getReviewByUserAndCourseId(courseId,userId);
  res.send(response.responseBody());
});

reviewRouter.put('/update',async (req,res) => {
  const reviewData = req.body.updatedReview;
  const response = await service.updateReview(reviewData);
  res.send(response.responseBody());
})

reviewRouter.get("/:courseId", async (req, res) => {
  const id = req.params.courseId;
  const response = await service.getReviewsByCourseId(id);
  res.send(response.responseBody());
});

reviewRouter.post("/create-review", async (req,res) => {
  const review = req.body.review;
  const response = await service.createReview(review);
  res.send(response.responseBody());
})



module.exports = { reviewRouter };
