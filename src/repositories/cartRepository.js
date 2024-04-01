const Carts = require('../models/carts')

module.exports = class CartRepository{
  async getCart(id){
    const cart = await Carts.findById(id).populate('items.itemId');
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
      const deletedCart = await Carts.deleteMany(entity);
      return deletedCart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}