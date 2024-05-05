const User = require("../models/users");
const mongoose = require("mongoose");
module.exports = class UserRepository {
  constructor() {
    this.model = User;
  }

  async create(data) {
    try {
      const newUser = new User(data);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async addWishlistItem(userId, courseId) {
    try {
      console.log(courseId);
      const userBeforeUpdate = await this.model.findOne({ _id: userId });

      if (userBeforeUpdate.wishlist.includes(courseId)) {
        return { user: userBeforeUpdate, wasItemAdded: false };
      }
      const userAfterUpdate = await this.model.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { wishlist: courseId } },
        { new: true }
      );
      console.log(userAfterUpdate);
      const wasItemAdded =
        userAfterUpdate.wishlist.length > userBeforeUpdate.wishlist.length;
      return { user: userAfterUpdate, wasItemAdded };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByEntity(entity) {
    try {
      const user = await this.model.findOne(entity);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getWishlist(userId) {
    try {
      const user = await this.model.findOne({ _id: userId }).populate({
        path: 'wishlist',
        model: 'courses',
        populate: {
          path: 'instructorId',
          model: 'users'
        }
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAll() {
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
      const user = await this.model.findOneAndUpdate(filter, entity, {
        new: true,
      });
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
