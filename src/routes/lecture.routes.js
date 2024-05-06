const express = require('express');
const LectureService = require('../services/lectureService');
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const { uploads } = require('../utils/cloudinary');
const service = new LectureService();
const lectureRouter = express.Router();

lectureRouter.get('/', async(req,res) => {
    const sectionId = req.query.sectionId;
    const response = await service.getLecturesBySectionId(sectionId);
    res.send(response.responseBody());
})

lectureRouter.get('/duration', async(req,res) => {
    const sectionId = req.query.sectionId;
    const response = await service.getDuration(sectionId);
    res.send(response.responseBody());
})

// try{
  lectureRouter.post('/create', verifyToken, uploads.single("videoFile"), async (req, res) => {
    if (!req.body.lectureData) {
      return res.send({ success: false, code: 400, message: 'Lecture data is required' });
  }
 
    const lectureData = JSON.parse(req.body.lectureData);
    const videoFile = req?.file;
    if (!videoFile) {
      return res.send({ success: false, code: 400, message: 'Video file is required' });
    }
    console.log(videoFile);
    const response = await service.createOneLecture(lectureData, videoFile);
    console.log(response);
    res.send(response.responseBody());

  });


  lectureRouter.put('/update-lecture', verifyToken, uploads.single("videoFile"), async (req, res) => {
    if (!req.body.lectureData) {
      return res.send({ success: false, code: 400, message: 'Lecture data is required' }); 
    }

    const lectureData = JSON.parse(req.body.lectureData);
    console.log(req.file);
    const videoFile = req.file;
    const response = await service.updateOneLecture(lectureData, videoFile);

    res.send(response.responseBody());
  });


// } catch (error) {
//   console.log(error)
// }
lectureRouter.delete('/delete-lecture/:lectureId', verifyToken, async (req, res) => {
  const { lectureId } = req.params;
  console.log(lectureId);
  const response = await service.deleteOneLecture(lectureId);

  res.send(response.responseBody());
});

module.exports = { lectureRouter };
