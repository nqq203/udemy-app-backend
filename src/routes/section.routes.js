const express = require('express');
const SectionService = require('../services/sectionService');
const service = new SectionService();
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const sectionRouter = express.Router();

sectionRouter.post('/create', verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.createSection(data);
  res.send(response.responseBody());
});

sectionRouter.post('/create-list', verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.createListSection(data);
  res.send(response.responseBody());
});

sectionRouter.get('/list', verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.getAllSections(data);
  res.send(response.responseBody());
});
sectionRouter.get('/', async(req,res) => {
  const courseId = req.query.id;
  const response = await service.getSectionsByCourseId(courseId);
  res.send(response.responseBody())
})
module.exports = { sectionRouter };
