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
      if (!entity) {
        return null
      }
      const itemExists = await this.model.findOne(entity);
      if (!itemExists) {
        return null
      }
      const deletedCart = await this.model.deleteOne(entity);
      return deletedCart;
    } catch (error) {
      console.error(error);
      return new Response({
        success:false,
        code: error.code || 500,
        message: error.message || 'Internal server error',
        data: null,
      });
    }
  }
  async getByEntity(entity){
    try {
      const cart = await this.model.findOne(entity);
      return cart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteAll(entity) {
    try {
      const deletedCart = await this.model.deleteMany(entity);
      return deletedCart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}