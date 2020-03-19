const Sequelize = require('sequelize');
const path = require('path');

let instance = null;

module.exports = () => {
  if (instance) {
    return instance;
  }

  instance = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../db.sqlite'),
    logging: false,
  });
  return instance;
};
