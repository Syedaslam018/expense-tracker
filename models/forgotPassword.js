const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const forgotPassword = sequelize.define('forgotPassword', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  isActive: Sequelize.BOOLEAN
})

module.exports = forgotPassword;