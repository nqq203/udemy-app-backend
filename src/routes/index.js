const { userRouter } = require('./user.routes');
const { orderRouter } = require('./order.routes');

module.exports = {
  userRouter,
}
function route(app) {
  app.use('/users', userRouter);
  app.use('/order', orderRouter);
}

module.exports = route;
