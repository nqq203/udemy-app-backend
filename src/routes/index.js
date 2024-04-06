const {userRouter} = require('./user.routes');
const {cartRouter} = require('./cart.routes')
module.exports = {
  userRouter,
  cartRouter
}
function route(app) {
  app.use('/users', userRouter);
  app.use('/carts', cartRouter)

}

module.exports = route;
