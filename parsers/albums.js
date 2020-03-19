const cheerio = require('cheerio');

const getArtistAlbums = (html) => {
  const $ = cheerio.load(html);
  if ($('#artist_ablums').length) {
    const category = $('.category:first-child a');
    const albums = Array
      .from(category)
      .map((albm) => {
        const $albm = $(albm);
        const perma = $albm.attr('href').substring(12);
        const name = $albm.find('.song').text();
        const artistName = $albm.find('.artist').text();
        const albumArt = $albm.find('img').attr('src');

        return {
          name,
          perma,
          album_art: albumArt,
          artist_name: artistName,
        };
      });

    return albums;
  }
  return [];
};

const getAlbumTracks = (html) => {
  const $ = cheerio.load(html);
  const tracksLi = $('#relatedTab li');
  const tracks = Array
    .from(tracksLi)
    .map((track, index) => {
      const $track = $(track);
      const mp3Id = $track.find('button').attr('mp3id');

      return {
        mp3Id,
        index,
      };
    });

  return tracks;
};

module.exports = {
  getArtistAlbums,
  getAlbumTracks,
};
