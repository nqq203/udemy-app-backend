const {userRouter} = require('./user.routes');
const {courseRouter} = require('./course.routes');
const {sectionRouter} = require('./section.routes');
const {lectureRouter} = require('./lecture.routes');
const {cartRouter} = require('./cart.routes');

function route(app) {
  app.use('/users', userRouter);
  app.use('/courses', courseRouter);
  app.use('/sections', sectionRouter);
  app.use('/lectures', lectureRouter);
  app.use('/carts', cartRouter);
}

module.exports = route;
