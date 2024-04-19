const mongoose = require("mongoose");
const { result } = require("lodash");
const Order = require("../models/orders");

module.exports = class OrderRepository {
  constructor() {
    this.model = Order;
  }

  async create(data) {
    try {
      const newOrder = new Order(data);
      await newOrder.save();
      return newOrder;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Get all by entity
  async getByEntity(entity) {
    try {
      const order = await this.model.find(entity);
      return order;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getCompletedOrdersByInstructorId(instructorId) {
    const objInstructorId = new mongoose.Types.ObjectId(instructorId);
    try {
      const result = await Order.aggregate([
        { $match: { status: "COMPLETED" } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "courses",
            localField: "items.itemId",
            foreignField: "_id",
            as: "courseDetails",
          },
        },
        { $unwind: "$courseDetails" },
        { $match: { "courseDetails.instructorId": objInstructorId } },
        {
          $group: {
            _id: "$courseDetails.instructorId",
            totalRevenue: { $sum: "$items.price" },
            totalSoldItems: { $sum: 1 },
          },
        },
      ]);
      //console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getCompletedOrdersByInstructorIdAndYear(instructorId, year) {
    const objInstructorId = new mongoose.Types.ObjectId(instructorId);
    try {
      const result = await Order.aggregate([
        {
          $match: {
            status: "COMPLETED",
            createdAt: {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lte: new Date(`${year}-12-31T23:59:59.999Z`),
            },
          },
        },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "courses",
            localField: "items.itemId",
            foreignField: "_id",
            as: "courseDetails",
          },
        },
        { $unwind: "$courseDetails" },
        { $match: { "courseDetails.instructorId": objInstructorId } },
        {
          $group: {
            _id: {
              instructor: "$courseDetails.instructorId",
              month: {$month: "$createdAt"}
            },
            totalRevenue: { $sum: "$items.price" },
            totalSoldItems: { $sum: 1 },
          },
        },
        { $sort: { "_id.month": 1 } }
      ]);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAll() {
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
