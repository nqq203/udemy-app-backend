const express = require("express");
const OrderService = require("../services/orderService");
const { verifyToken } = require("../middlewares/authorization");
const { NotFoundResponse } = require("../common/error.response");
const service = new OrderService();
const orderRouter = express.Router();

String.prototype.toObjectId = function () {
  var ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(this.toString());
};

orderRouter.post("/create", verifyToken, async (req, res) => {
  const items = req.body.items;
  items.forEach((item) => {
    item.itemId = item.itemId.toObjectId();
  });

  const orderData = {
    userId: req.body.userId.toObjectId(),
    items: items,
    price: req.body.totalPrice,
    paymentId: req.body.paymentId,
  };

  const response = await service.createOrder(orderData);
  res.send(response.responseBody());
});

orderRouter.get('/get-purchase-history', async (req, res) => {
  const userId = req.query.userId;
  const orders = await service.getPurchaseHistory(userId);
  console.log(orders)
  res.send(orders.responseBody());
  //res.send(orders.responseBody());
});

orderRouter.get("/order-by-user", async (req, res) => {
  const orderData = req.query;
  if (orderData.userId === undefined) {
    res.send(new NotFoundResponse("Order Not Found"));
  } else {
    orderData.userId = orderData.userId.toObjectId();
    const response = await service.getOrderByUser(orderData);
    res.send(response.responseBody());
  }
});

orderRouter.get("/completed-orders", async (req, res) => {
  const { instructorId } = req.query;
  //console.log(instructorId)
  const response = await service.getCompletedOrdersByInstructorId(instructorId);
  res.send(response.responseBody());
});

orderRouter.get("/completed-orders-by-year", async (req, res) => {
  const { instructorId } = req.query;
  const response = await service.getCompletedOrdersByInstructorIdAndYear(
    instructorId,
    2024
  );
  res.send(response.responseBody());
});

orderRouter.get("/list", async (req, res) => {
  const response = await service.getAllOrders();
  res.send(response.responseBody());
});

orderRouter.post('/create-paypal-order', (req, res) => {
  get_access_token()
      .then(access_token => {
          let order_data_json = {
              'intent': req.body.intent.toUpperCase(),
              'purchase_units': [{
                  'amount': {
                      'currency_code': 'USD',
                      'value': '100.00'
                  }
              }]
          };
          const data = JSON.stringify(order_data_json)

          fetch(endpoint_url + '/v2/checkout/orders', { //https://developer.paypal.com/docs/api/orders/v2/#orders_create
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${access_token}`
                  },
                  body: data
              })
              .then(res => res.json())
              .then(json => {
                  res.send(json);
              }) 
      })
      .catch(err => {
          console.log(err);
          res.status(500).send(err)
      })
});

orderRouter.post('/complete-paypal-order', (req, res) => {
  get_access_token()
      .then(access_token => {
          fetch(endpoint_url + '/v2/checkout/orders/' + req.body.order_id + '/' + req.body.intent, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${access_token}`
                  }
              })
              .then(res => res.json())
              .then(json => {
                  console.log(json);
                  res.send(json);
              }) 
      })
      .catch(err => {
          console.log(err);
          res.status(500).send(err)
      })
});


module.exports = { orderRouter };
