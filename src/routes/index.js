const {userRouter} = require('./user.routes');
const {cartRouter} = require('./cart.routes')
const {courseRouter} = require('./course.routes');
const {sectionRouter} = require('./section.routes');
const {lectureRouter} = require('./lecture.routes');

const {reviewRouter} = require('./review.routes');


module.exports = {
   userRouter,
  courseRouter,
  sectionRouter,
  lectureRouter,
  cartRouter
}
function route(app) {
  app.use('/users', userRouter);
  app.use('/courses', courseRouter);
  app.use('/sections', sectionRouter); 
  app.use('/lectures', lectureRouter);
  app.use('/carts', cartRouter)
  app.use('/review', reviewRouter);
}

module.exports = route;
