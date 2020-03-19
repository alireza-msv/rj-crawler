const net = require('./net');
const albumsParser = require('../parsers/albums');
const artistsDb = require('../db/artists');
const albumsDb = require('../db/albums');
const mp3sDb = require('../db/mp3s');

const getArtistsAlbums = async (continuous = true, interval = 1000) => {
  const artist = await artistsDb.findOnePending();

  if (artist) {
    console.log(`getting albums of ${artist.name} (${artist.perma})`);
    const response = await net.get(`artist/${artist.perma}`);

    if (response.status === 200) {
      const albums = albumsParser.getArtistAlbums(response.data);
      if (albums.length) {
        console.log(`${albums.length} album(s) found`);
        console.log('saving albums in db');

        for (let i = 0; i < albums.length; i += 1) {
          await albumsDb.findOrCreate({
            ...albums[i],
            artist_perma: artist.perma,
          });
        }
      } else {
        console.log('no album found');
      }

      artist.status = 'CRAWLED';
      await artist.save();

      if (continuous && interval) {
        setTimeout(() => {
          getArtistsAlbums(continuous, interval);
        }, interval);
      } else if (continuous) {
        getArtistsAlbums(continuous, interval);
      }
    }
  } else {
    console.log('there\'s no artist left');
  }
};

const getAlbumTracks = async (continuous = true, interval = 1000) => {
  const album = await albumsDb.findOnePending();

  if (album) {
    console.log(`getting mp3 tracks of ${album.name} (${album.perma})`);
    const response = await net.get(`mp3s/album/${album.perma}`);

    if (response.status === 200) {
      const tracks = albumsParser.getAlbumTracks(response.data);
      console.log(`${tracks.length} tracks found`);

      for (let i = 0; i < tracks.length; i += 1) {
        await mp3sDb.update({
          album: album.name,
          album_perma: album.perma,
          index: tracks[i].index,
        }, { mp3_id: tracks[i].mp3Id });
      }

      album.status = 'CRAWLED';
      album.tracks_count = tracks.length;
      await album.save();

      if (continuous && interval) {
        setTimeout(() => {
          getAlbumTracks(continuous, interval);
        }, interval);
      } else if (continuous) {
        getAlbumTracks(continuous, interval);
      }
    }
  } else {
    console.log('there\'s no album left');
  }
};

module.exports = {
  getArtistsAlbums,
  getAlbumTracks,
};
