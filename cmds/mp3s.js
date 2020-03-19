const net = require('./net');
const mp3sParser = require('../parsers/mp3s');
const mp3sDb = require('../db/mp3s');
const artistsDb = require('../db/artists');

const getFeaturedMp3s = async (page = 1, continuous = true, interval = 1000) => {
  try {
    console.log(`getting featured mp3s in page ${page}`);
    const response = await net.get('/mp3s/browse/featured/all', { page });

    if (response.status === 200) {
      const mp3s = mp3sParser.getFeaturedMp3s(response.data);

      if (mp3s.length) {
        console.log(`${mp3s.length} mp3(s) found`);
        for (let i = 0; i < mp3s.length; i += 1) {
          await mp3sDb.findOrCreate(mp3s[i]);
        }

        if (continuous && interval) {
          setTimeout(() => {
            getFeaturedMp3s(page + 1, continuous, interval);
          }, interval);
        } else if (continuous) {
          getFeaturedMp3s(page + 1, continuous, interval);
        }
      } else {
        console.log('no mp3 found');
      }
    }
  } catch (ex) {
    console.log(ex);
  }
};

const getMp3Details = async (continuous, interval = 1000) => {
  try {
    const mp3 = await mp3sDb.findOnePending();

    if (mp3) {
      console.log(`getting details of ${mp3.name} (${mp3.perma})`);
      const response = await net.get(`mp3s/mp3/${mp3.perma}`);

      if (response.status === 200) {
        const details = mp3sParser.getMp3Details(response.data);
        console.log('saving details');
        await mp3sDb.update({ ...details, status: 'CRAWLED' }, { perma: mp3.perma });
      } else if (response.status === 302) {
        mp3.status = 'MOVED';
        await mp3.save();
      }

      if (continuous && interval) {
        setTimeout(() => {
          getMp3Details(continuous, interval);
        }, interval);
      } else if (continuous) {
        getMp3Details(continuous, interval);
      }
    } else {
      console.log('no pending mp3 found');
    }
  } catch (ex) {
    console.log(ex);
  }
};

const findMp3Host = async (continuous, interval = 1000) => {
  try {
    const mp3 = await mp3sDb.findOne({ file_url: null });

    if (mp3) {
      console.log(`getting host of ${mp3.name} (${mp3.perma})`);
      const response = await net.post('mp3s/mp3_host', { id: mp3.perma });

      if (response.status === 200) {
        const { host } = response.data;
        const fileUrl = `${host}/media/mp3/mp3-320/${mp3.perma}.mp3`;
        mp3.host = host;
        mp3.file_url = fileUrl;
        console.log('saving host and file url');
        await mp3.save();
      }

      if (continuous && interval) {
        setTimeout(() => {
          findMp3Host(continuous, interval);
        }, interval);
      } else if (continuous) {
        findMp3Host(continuous, interval);
      }
    } else {
      console.log('there\'s no mp3 left');
    }
  } catch (ex) {
    console.log(ex);
  }
};

const getArtistsMp3s = async (continuous = true, interval = 1000) => {
  const artist = await artistsDb.findOnePending();

  if (artist) {
    console.log(`getting for mp3s of ${artist.name}(${artist.perma})`);
    const response = await net.get(`mp3s/browse/artist/${artist.perma}`);

    if (response.status === 200) {
      const mp3s = await mp3sParser.getMp3sByArtist(response.data);
      console.log(`${mp3s.length} mp3s found`);

      for (let i = 0; i < mp3s.length; i += 1) {
        await mp3sDb.findOrCreate(mp3s[i]);
      }

      artist.status = 'CRAWLED';
      await artist.save();

      if (continuous && interval) {
        setTimeout(() => {
          getArtistsMp3s();
        }, interval);
      } else if (continuous) {
        getArtistsMp3s();
      }
    }
  } else {
    console.log('no uncrawled artist found');
  }
};

module.exports = {
  getFeaturedMp3s,
  getMp3Details,
  findMp3Host,
  getArtistsMp3s,
};
