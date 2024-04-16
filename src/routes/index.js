const {userRouter} = require('./user.routes');
const {cartRouter} = require('./cart.routes')
const {courseRouter} = require('./course.routes');
const {reviewRouter} = require('./review.routes');
const {sectionRouter} = require('./section.routes');
const {lectureRouter} = require('./lecture.routes');
const { orderRouter } = require('./order.routes');

module.exports = {
  userRouter,
  courseRouter,
  sectionRouter,
  lectureRouter,
  cartRouter
}
function route(app) {
  app.use('/users', userRouter);
  app.use('/lectures',lectureRouter);
  app.use('/carts', cartRouter)
  app.use('/orders', orderRouter);
  app.use('/review', reviewRouter);
  app.use('/courses', courseRouter);
  app.use('/sections', sectionRouter);
}

module.exports = route;
