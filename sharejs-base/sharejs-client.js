var ShareJSTextConnector,                  
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ShareJSConnector = (function() {
  var getOptions;

  getOptions = function() {
    return {
      origin: '//' + window.location.host + '/channel',
      authentication: (typeof Meteor.userId === "function" ? Meteor.userId() : void 0) || null
    };
  };

  function ShareJSConnector(parentView) {
    var docIdVar, params;
    docIdVar = new Blaze.ReactiveVar;
    parentView.onViewReady(function() {
      return this.autorun(function() {
        var data;
        data = Blaze.getData();
        return docIdVar.set(data.docid);
      });
    });
    parentView.onViewDestroyed((function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
    this.isCreated = false;
    this.docIdVar = docIdVar;
    params = Blaze.getData(parentView);
    this.configCallback = params.onRender;
    this.connectCallback = params.onConnect;
  }

  ShareJSConnector.prototype.create = function() {
    var connector;
    if (this.isCreated) {
      throw new Error("Already created");
    }
    connector = this;
    this.isCreated = true;
    this.view = this.createView();
    this.view.onViewReady(function() {
      connector.rendered(this.firstNode());
      return this.autorun(function() {
        var docId;
        docId = connector.docIdVar.get();
        connector.disconnect();
        if (docId) {
          return connector.connect(docId);
        }
      });
    });
    return this.view;
  };

  ShareJSConnector.prototype.rendered = function(element) {
    return this.element = element;
  };

  ShareJSConnector.prototype.connect = function(docId, element) {
    var me = this
    this.connectingId = docId;
    console.log("connect docId: %s", docId);
    var socket = new BCSocket(null, {
      reconnect: true
    });
    var connection = new sharejs.Connection(socket);
    
    connection.on('connected', function(){
        console.log('connected')
    })
    connection.on('connecting', function(){
        console.log('connecting')
    })
    connection.on('disconnected', function(){
        console.log('disconnected')
    })
    
    var doc = connection.get('users', docId);
    console.log(doc);
    doc.subscribe();
    //debugger
    doc.whenReady(function () {
      me.attach(doc)
//      if (!doc.type) doc.create('text');
//      if (doc.type && doc.type.name === 'text')
//        doc.attachTextarea(element);
    });
    
  };

  ShareJSConnector.prototype.attach = function(doc) {
    return this.doc = doc;
  };

  ShareJSConnector.prototype.disconnect = function() {
    if (this.doc != null) {
      this.doc.close();
      return this.doc = null;
    }
  };

  ShareJSConnector.prototype.destroy = function() {
    if (this.isDestroyed) {
      throw new Error("Already destroyed");
    }
    this.disconnect();
    this.view = null;
    return this.isDestroyed = true;
  };

  return ShareJSConnector;

})();

ShareJSTextConnector = (function(_super) {
  __extends(ShareJSTextConnector, _super);

  function ShareJSTextConnector() {
    return ShareJSTextConnector.__super__.constructor.apply(this, arguments);
  }

  ShareJSTextConnector.prototype.createView = function() {
    return Blaze.With(Blaze.getData, function() {
      return Template._sharejsText;
    });
  };

  ShareJSTextConnector.prototype.rendered = function(element) {
    ShareJSTextConnector.__super__.rendered.apply(this, arguments);
    this.textarea = element;
    return typeof this.configCallback === "function" ? this.configCallback(this.textarea) : void 0;
  };

  ShareJSTextConnector.prototype.connect = function() {
    this.textarea.disabled = true;
    return ShareJSTextConnector.__super__.connect.apply(this, arguments);
  };

  ShareJSTextConnector.prototype.attach = function(doc) {
    ShareJSTextConnector.__super__.attach.apply(this, arguments);
    doc.attachTextarea(this.textarea);
    this.textarea.disabled = false;
    return typeof this.connectCallback === "function" ? this.connectCallback(this.textarea) : void 0;
  };

  ShareJSTextConnector.prototype.disconnect = function() {
    var _ref;
    if ((_ref = this.textarea) != null) {
      if (typeof _ref.detach_share === "function") {
        _ref.detach_share();
      }
    }
    return ShareJSTextConnector.__super__.disconnect.apply(this, arguments);
  };

  ShareJSTextConnector.prototype.destroy = function() {
    ShareJSTextConnector.__super__.destroy.apply(this, arguments);
    return this.textarea = null;
  };

  return ShareJSTextConnector;

})(ShareJSConnector);

UI.registerHelper("sharejsText", new Template('sharejsText', function() {
  return new ShareJSTextConnector(this).create();
}));
