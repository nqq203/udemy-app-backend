const express = require("express");
const OrderService = require("../services/orderService");
const { verifyToken } = require("../middlewares/authorization");
const { NotFoundResponse } = require("../common/error.response");
const service = new OrderService();
const orderRouter = express.Router();

const paypal = require('@paypal/checkout-server-sdk');
const Environment = paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(new Environment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
));
const endpoint_url = 'https://api-m.sandbox.paypal.com';

String.prototype.toObjectId = function () {
  var ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(this.toString());
};

function get_access_token() {
  const auth = `${client_id}:${client_secret}`
  const data = 'grant_type=client_credentials'
  return fetch(endpoint_url + '/v1/oauth2/token', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
          },
          body: data
      })
      .then(res => res.json())
      .then(json => {
          return json.access_token;
      })
}

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

  // const paypalRequest = new paypal.orders.OrdersCreateRequest();
  // const totalPrice = req.body.totalPrice;
  // paypalRequest.prefer('return=representation');
  // paypalRequest.requestBody({
  //   intent: 'CAPTURE',
  //   purchase_units: [{
  //     amount: {
  //       currency_code: 'USD',
  //       value: totalPrice,
  //     },
  //     items: items.map(item => {
  //       return {
  //         name: item.itemId,
  //         unit_amount: {
  //           currency_code: 'USD',
  //           value: item.price,
  //         },
  //       };
  //     }),
  //   }],
  // });

  // try {
  //   const order = await paypalClient.execute(paypalRequest);
  //   console.log(order);
  // } catch (err) {
  //   console.error(err);
  // }

  const response = await service.createOrder(orderData);
  res.send(response.responseBody());
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
