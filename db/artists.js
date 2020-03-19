const Sequelize = require('sequelize');
const instance = require('./index');

class Artist extends Sequelize.Model {}
Artist.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  perma: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  thumb: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.DataTypes.ENUM(['PENDING', 'CRAWLED', 'FAILED']),
    defaultValue: 'PENDING',
  },
}, {
  sequelize: instance(),
  modelName: 'artists',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const sync = (force = false) => Artist.sync({ force });
const findOrCreate = (artist) => Artist.findOrCreate({
  where: { perma: artist.perma },
  defaults: artist,
});
const findOnePending = () => Artist.findOne({ where: { status: 'PENDING' } });
const update = (values, options) => Artist.update(values, options);

module.exports = {
  sync,
  findOrCreate,
  findOnePending,
  update,
};
