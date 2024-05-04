

  const {userRouter} = require('./user.routes');
  const {cartRouter} = require('./cart.routes')
  const {courseRouter} = require('./course.routes');
  const {reviewRouter} = require('./review.routes');
  const {sectionRouter} = require('./section.routes');
  const {lectureRouter} = require('./lecture.routes');
  const { orderRouter } = require('./order.routes');
  const { noteRouter } = require('./note.routes');

  module.exports = {
    userRouter,
    courseRouter,
    sectionRouter,
    lectureRouter,
    cartRouter
  }

  try{
  function route(app) {
    app.use('/users', userRouter);
    app.use('/lectures',lectureRouter);
    app.use('/carts', cartRouter)
    app.use('/orders', orderRouter);
    app.use('/review', reviewRouter);
    app.use('/courses', courseRouter);
    app.use('/sections', sectionRouter);
    app.use('/notes', noteRouter);
  }

module.exports = route;
} catch (error) {
  console.log(error);
}