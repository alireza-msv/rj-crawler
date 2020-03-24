const cheerio = require('cheerio');
const htmlEntities = require('html-entities').Html5Entities;

const crawlMp3sPage = (html) => {
  const $ = cheerio.load(html);
  const container = $('#browse_mp3s_container a');
  const mp3s = Array
    .from(container)
    .map((item) => {
      const $item = $(item);
      const name = $item.find('.song').text();
      const perma = encodeURIComponent($item.attr('href').substring(10));
      const albumArt = $item.find('img').attr('src');
      const artistName = $item.find('.artist').text();
      const artistPerma = encodeURIComponent(encodeURIComponent(artistName.replace(/\s/g, '+')));

      return {
        name,
        perma,
        album_art: albumArt,
        artist_name: artistName,
        artist_perma: artistPerma,
      };
    });

  return mp3s;
};

const getMp3sByArtist = (html) => crawlMp3sPage(html);

const getFeaturedMp3s = (html) => crawlMp3sPage(html);

const getMp3Details = (html) => {
  const $ = cheerio.load(html);
  const mp3Id = parseInt($('.mp3_playlist_add_player').attr('mp3id'), 10);
  const views = parseInt($('.views').text().substring(7).replace(/,/g, ''), 10);
  const dateAdded = $('.dateAdded').text().substring(12);
  const likes = parseInt($('.rating')
    .eq(0)
    .text()
    .replace(/,/g, '')
    .replace('likes', ''), 10);

  const dislikes = parseInt($('.rating')
    .eq(1)
    .text()
    .replace(/,/g, '')
    .replace('dislikes', ''), 10);
  const permaStart = html.indexOf('currentMP3Perm');
  const permaEnd = html.indexOf(';', permaStart);
  const fileName = html.substring(permaStart + 18, permaEnd - 1);
  const plays = parseInt($('.views').text().substring(7).replace(/,/g, ''), 10);
  const descriptionNode = $('.mp3Description');
  descriptionNode.find('.dateAdded').remove();
  descriptionNode.find('.views').remove();

  let description = null;
  if (descriptionNode.html()) {
    description = htmlEntities.decode($('.mp3Description').html().replace(/(\t|\n)/g, '').replace(/<br>/g, '\n'));
  }
  const lyricsContainer = $('.lyricsFarsi');
  const lyrics = htmlEntities.decode(lyricsContainer.length ? lyricsContainer.html().replace(/(\t|\n)/g, '').replace(/<br>/g, '\n') : '');
  const tags = Array
    .from($('.tagsContainer a'))
    .map((tag) => {
      const $tag = $(tag);
      const tagPerma = $tag.attr('href').substring(17);
      const tagName = $tag.text();

      return { perma: tagPerma, tag: tagName };
    });

  return {
    mp3_id: mp3Id,
    views,
    date_added: new Date(dateAdded),
    likes,
    dislikes,
    file_name: fileName,
    description,
    lyrics,
    plays,
    tags: JSON.stringify(tags),
  };
};

module.exports = {
  getMp3sByArtist,
  getFeaturedMp3s,
  getMp3Details,
};
