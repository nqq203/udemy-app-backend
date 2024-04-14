const Order = require('../models/orders');

module.exports = class OrderRepository{
  constructor(){
      this.model = Order;
  }

  async create(data){
    try {
      const newOrder = new Order(data);
      await newOrder.save();
      return newOrder;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByEntity(entity){
    try {
      const order = await this.model.find(entity);
      return order;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAll(){
    try {
      const allOrders = await this.model.find();
      return allOrders;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(filter, entity) {
    try {
      const Order = await this.model.findOneAndUpdate(filter, entity);
      return Order;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(entity) {
    try {
      const deletedOrder = await this.model.deleteMany(entity);
      return deletedOrder;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};