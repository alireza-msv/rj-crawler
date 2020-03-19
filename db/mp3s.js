const Sequelize = require('sequelize');
const instance = require('./index');

class Mp3 extends Sequelize.Model {}
Mp3.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  perma: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  artist_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  artist_perma: {
    type: Sequelize.STRING,
  },
  album: {
    type: Sequelize.STRING,
  },
  album_perma: {
    type: Sequelize.STRING,
  },
  index: {
    type: Sequelize.NUMBER,
  },
  mp3_id: {
    type: Sequelize.NUMBER,
  },
  album_art: {
    type: Sequelize.STRING,
  },
  plays: {
    type: Sequelize.NUMBER,
  },
  date_added: {
    type: Sequelize.DATEONLY,
  },
  likes: {
    type: Sequelize.NUMBER,
  },
  dislikes: {
    type: Sequelize.NUMBER,
  },
  host: {
    type: Sequelize.DataTypes.ENUM(['host1', 'host2']),
  },
  file_name: {
    type: Sequelize.STRING,
  },
  file_url: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  lyrics: {
    type: Sequelize.STRING,
  },
  tags: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.DataTypes.ENUM(['PENDING', 'CRAWLED', 'FAILED']),
    defaultValue: 'PENDING',
  },
}, {
  sequelize: instance(),
  modelName: 'mp3s',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const sync = (force = false) => Mp3.sync({ force });
const findOrCreate = (mp3) => Mp3.findOrCreate({
  where: { perma: mp3.perma },
  defaults: mp3,
});
const findOnePending = () => Mp3.findOne({ where: { status: 'PENDING' } });
const update = (values, where) => Mp3.update(values, { where });
const findOne = (where) => Mp3.findOne({ where });

module.exports = {
  sync,
  findOrCreate,
  findOnePending,
  update,
  findOne,
};
