const Sequelize = require('sequelize');
const instance = require('./index');

class Album extends Sequelize.Model {}
Album.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  perma: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  album_art: {
    type: Sequelize.STRING,
  },
  artist_name: {
    type: Sequelize.STRING,
  },
  artist_perma: {
    type: Sequelize.STRING,
  },
  tracks_count: {
    type: Sequelize.NUMBER,
  },
  status: {
    type: Sequelize.DataTypes.ENUM(['PENDING', 'CRAWLED']),
    defaultValue: 'PENDING',
  },
}, {
  sequelize: instance(),
  modelName: 'albums',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const sync = (force = false) => Album.sync({ force });
const findOrCreate = (album) => Album.findOrCreate({
  where: { perma: album.perma },
  defaults: album,
});
const findOnePending = () => Album.findOne({ where: { status: 'PENDING' } });
const update = (values, where) => Album.update(values, { where });

module.exports = {
  sync,
  findOrCreate,
  findOnePending,
  update,
};
