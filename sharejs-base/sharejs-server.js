var Duplex, Future, backend, browserChannel, livedb, options, share, sharejs, stream, _ref;         

Future = Npm.require('fibers/future');

ShareJS = ShareJS || {};

debugger;

Meteor._debug("Ciao from Meteor._debug");

RoutePolicy.declare('/channel/', 'network');

stream = Npm.require('stream');

livedb = Npm.require('livedb');

sharejs = Npm.require('share');

backend = livedb.client(livedb.memory());

share = Npm.require('share').server.createClient({
  backend: backend
});

Duplex = Npm.require('stream').Duplex;

browserChannel = Npm.require('browserchannel').server;

WebApp.connectHandlers.use(browserChannel({
  sessionTimeoutInterval: 5000
}, function(client) {
  console.log('client connect');
  stream = new Duplex({
    objectMode: true
  });
  stream._write = function(chunk, encoding, callback) {
    console.log('s->c: %s, state %s', JSON.stringify(chunk), client.state);
    if (client.state !== 'closed') {
      client.send(chunk);
    }
    return callback();
  };
  stream._read = function() {};
  stream.headers = client.headers;
  stream.remoteAddress = stream.address;
  client.on('message', function(data) {
    console.log('c->s ', JSON.stringify(data));
    return stream.push(data);
  });
  stream.on('error', function(msg) {
    console.log('client error ', msg);
    return client.stop();
  });
  client.on('close', function(reason) {
    stream.push(null);
    return stream.emit('close');
  });
  //console.log('client went away');
  stream.on('end', function() {
    return client.close();
  });
  return share.listen(stream);
}));