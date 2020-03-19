const net = require('./net');
const artistsParser = require('../parsers/artists');
const artistsDb = require('../db/artists');

const getAllArtists = async (page = 1, continuous = true, interval = 1000) => {
  console.log(`getting for artists in page: ${page}`);
  const response = await net.get('mp3s/browse/artists/All', { page });

  if (response.status === 200) {
    const list = artistsParser.getArtists(response.data);

    if (list.length) {
      console.log(`${list.length} artists found`);
      console.log('saving result');

      for (let i = 0; i < list.length; i += 1) {
        await artistsDb.findOrCreate(list[i]);
      }

      if (continuous && interval) {
        setTimeout(() => {
          getAllArtists(page + 1, continuous, interval);
        }, interval);
      } else if (continuous) {
        getAllArtists(page + 1, continuous, interval);
      }
    } else {
      console.log('no artist found');
    }
  }
};

module.exports = {
  getAllArtists,
};
