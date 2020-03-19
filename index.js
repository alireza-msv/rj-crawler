const Commander = require('commander');
const { version } = require('./package.json');
const mp3sCommands = require('./cmds/mp3s');
const artistsCommands = require('./cmds/artists');
const albumsCommands = require('./cmds/albums');

const parseOptions = (options) => {
  const continuous = Boolean(options.continuous);
  const interval = options.interval ? parseInt(options.interval, 10) : 1000;
  const page = options.page ? parseInt(options.page, 10) : 1;

  return { continuous, interval, page };
};

const program = new Commander.Command();
program.version(version);
program
  .passCommandToAction(true)
  .option('--page <page>')
  .option('--continuous')
  .option('--interval <interval>')
  .on('command:artists', async ([cmd]) => {
    const options = program.opts();
    const { continuous, interval, page } = parseOptions(options);

    switch (cmd) {
      case 'all':
        await artistsCommands.getAllArtists(page, continuous, interval);
        break;
      case 'crawl':
        await mp3sCommands.getArtistsMp3s(continuous, interval);
        break;
      default:
        console.log('command not found');
    }
  })
  .on('command:mp3s', async ([cmd]) => {
    const options = program.opts();
    const { continuous, interval, page } = parseOptions(options);

    switch (cmd) {
      case 'featured':
        await mp3sCommands.getFeaturedMp3s(page, continuous, interval);
        break;
      case 'crawl':
        await mp3sCommands.getMp3Details(continuous, interval);
        break;
      case 'hosts':
        await mp3sCommands.findMp3Host(continuous, interval);
        break;
      default:
        console.log('command not found');
    }
  })
  .on('command:albums', async ([cmd]) => {
    const options = program.opts();
    const { continuous, interval } = parseOptions(options);

    switch (cmd) {
      case 'artist':
        await albumsCommands.getArtistsAlbums(continuous, interval);
        break;
      case 'crawl':
        await albumsCommands.getAlbumTracks(continuous, interval);
        break;
      default:
        console.log('command not found');
    }
  });

program.parse(process.argv);
