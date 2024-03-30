const {userRouter} = require('./user.routes');
const {courseRouter} = require('./course.routes');
module.exports = {
  userRouter,
}
function route(app) {
  app.use('/users', userRouter);
  app.use('/product', courseRouter);
}

module.exports = route;
