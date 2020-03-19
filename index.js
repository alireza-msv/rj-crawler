const Commander = require('commander');
const { version } = require('./package.json');
const mp3sCommands = require('./cmds/mp3s');
const artistsCommands = require('./cmds/artists');
const albumsCommands = require('./cmds/albums');
const { sync: syncAlbums } = require('./db/albums');
const { sync: syncArtists } = require('./db/artists');
const { sync: syncMp3s } = require('./db/mp3s');

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
  .option('--force')
  .command('artists <cmd>')
  .description('crawl RadioJavan for artists')
  .action(async (cmd) => {
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
  });

program
  .command('mp3s <cmd>')
  .description('crawl RadioJavan for mp3s or details of mp3s')
  .action(async (cmd) => {
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
  });

program
  .command('albums <cmd>')
  .description('crawl RadioJavan form albums or get album tracks list')
  .action(async (cmd) => {
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

program
  .command('sync')
  .description('sync database tables model with db file')
  .action(async () => {
    const force = Boolean(program.opts().force);

    await syncAlbums(force);
    await syncArtists(force);
    await syncMp3s(force);
  });

program.parse(process.argv);
