const cheerio = require('cheerio');

const getArtists = async (html) => {
  const $ = cheerio.load(html);
  const container = $('#artists_videos_container a');
  const artists = Array
    .from(container)
    .map((item) => {
      const $item = $(item);
      const name = $item.find('.artist').text();
      const perma = $item.attr('href').substring(20);
      const thumb = $item.find('img').attr('src');
      return {
        name,
        perma,
        thumb,
      };
    });

  return artists;
};

module.exports = {
  getArtists,
};
