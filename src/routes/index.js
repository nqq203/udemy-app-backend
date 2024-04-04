const {userRouter} = require('./user.routes');
const {courseRouter} = require('./course.routes');
const {reviewRouter} = require('./review.routes');

module.exports = {
  userRouter,
}
function route(app) {
  app.use('/users', userRouter);
  app.use('/course', courseRouter);
  app.use('/review', reviewRouter);
}

module.exports = route;
