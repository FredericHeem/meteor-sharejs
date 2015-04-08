Package.describe({
  name: "mizzao:sharejs",
  summary: "server (& client library) to allow concurrent editing of any kind of content",
  version: "0.7.3",
  git: "https://github.com/mizzao/meteor-sharejs.git"
});

Npm.depends({
  livedb:"0.4.11",
  browserchannel:"2.0.0",
  share:"0.7.27"
  //share: "https://github.com/FredericHeem/ShareJS/tarball/683c24fabff7a817ada2d2bb480fef57b2bc36da"
});

Package.onUse(function (api) {
  api.versionsFrom("1.0.4");

  api.use(['coffeescript', 'underscore']);
  api.use(['handlebars', 'templating'], 'client');
  api.use(['mongo-livedata', 'routepolicy', 'webapp'], 'server');

  // ShareJS script files
  api.addFiles([
      '.npm/package/node_modules/browserchannel/dist/bcsocket.js',
      '.npm/package/node_modules/share/webclient/share.uncompressed.js'
  ], 'client');

  
  // Add the ShareJS connectors
  //api.addFiles('.npm/package/node_modules/share/webclient/textarea.js', 'client');

  // TODO these cannot be easily added by the subpackages, unfortunately
  // We add them as an asset so that they can be loaded later, asynchronously
  //no longer in sharejs 0.7.x
  // Our files
  api.addFiles([
      'sharejs-templates.html',
      'sharejs-client.js'
  ], 'client');

  // Server files
  api.addFiles([
      'sharejs-meteor-auth.coffee',
      'sharejs-server.js'
  ], 'server');

  // Export the ShareJS interface
  api.export('ShareJS', 'server');

  // For subpackages to extend client functionality
  api.export('ShareJSConnector', 'client');
});

