const {userRouter} = require('./user.routes');
const {courseRouter} = require('./course.routes');
const {reviewRouter} = require('./review.routes');
const {sectionRouter} = require('./section.routes');
const {lectureRouter} = require('./lecture.routes');

// module.exports = {
//   userRouter,
// }
function route(app) {
  app.use('/users', userRouter);
  app.use('/review', reviewRouter);
  app.use('/courses', courseRouter);
  app.use('/sections', sectionRouter);
  app.use('/lectures', lectureRouter);
}

module.exports = route;
