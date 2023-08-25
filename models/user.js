const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
  },
  totalExpenses: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database')

// const User = sequelize.define('users', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false
//   },
//   name: Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true

//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   isPremiumUser: Sequelize.BOOLEAN,
//   totalExpenses: Sequelize.INTEGER
// })

// module.exports = User;
