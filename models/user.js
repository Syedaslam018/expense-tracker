const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
    
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isPremiumUser: Sequelize.BOOLEAN,
  totalExpenses: Sequelize.INTEGER
})

module.exports = User;