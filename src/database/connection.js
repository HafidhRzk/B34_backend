const Sequelize = require('sequelize');
const db = {};
const sequelize = new Sequelize('course-express-b34', 'root', 'root', {
  host: 'localhost' || 'https://b34-backend.herokuapp.com/api/v1',
  dialect: 'mysql',
  logging: console.log,
  freezeTableName: true,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

db.sequelize = sequelize;

module.exports = db;
