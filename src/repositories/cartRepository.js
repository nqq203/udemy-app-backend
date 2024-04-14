const Carts = require('../models/carts')

module.exports = class CartRepository{
  constructor(){
    this.model = Carts
  }
  async getAll(userId){
    const carts = await Carts.find({userId});
    return carts
  }
  async getCart(id){
    const cart = await this.model.find({userId: id});
    return cart
  }
  async create(data){
    const cart = new Carts(data);
    return await cart.save();
  }

  async update(filter, entity) {
    try {
      const cart = await Carts.findOneAndUpdate(filter, entity);
      return cart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(entity) {
    try {
      const deletedCart = await this.model.deleteOne(entity);
      return deletedCart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}