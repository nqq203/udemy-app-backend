const User = require('../models/user');

module.exports = class UserRepository{
  constructor(){
      this.model = User;
  }

  async create(data){
    try {
      const newUser = new User(data);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByEntity(entity){
    try {
      const user = await this.model.findOne(entity);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAll(){
    try {
      const allUsers = await this.model.find();
      return allUsers;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //Test Update Function
  async update(filter, entity) {
    try {
      const user = await this.model.findOneAndUpdate(filter, entity);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //Test Delete Function
  async delete(entity) {
    try {
      const deletedUser = await this.model.deleteMany(entity);
      return deletedUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};