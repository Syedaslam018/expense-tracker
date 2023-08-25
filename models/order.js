const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database')

// const Order = sequelize.define('order', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false
//   },
//   paymentId: Sequelize.STRING,
//   orderId: Sequelize.STRING,
//   status: Sequelize.STRING

// })

module.exports = mongoose.model("Order", orderSchema);
