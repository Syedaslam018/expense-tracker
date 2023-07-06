const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const userS3Files = sequelize.define('users3files', {
  url: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
})

module.exports = userS3Files;