const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const Expense = sequelize.define('expenses', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  amount: Sequelize.INTEGER,
  desc: {
    type: Sequelize.STRING,
    allowNull: false
    
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Expense;