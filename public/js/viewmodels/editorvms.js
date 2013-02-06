////////////////////////////////////////////////////////////////
var EditorViewModel = function () {
  var self = this;
  self.currentItem = ko.observable();
  self.files = ko.observableArray();
  self.converters = ko.observableArray([
    new Converter(textile,'Textile')
    ,new Converter(markdown.toHTML,'Markdown')
  ]);
  self.converter = ko.observable(self.converters[0]);
  self.currentDir = ko.observable('/');

  self.preview = ko.computed(function () {
    var def,result;
    def = result = '';

    if (self.currentItem()) {
      var contents = self.currentItem().contents();
      if (!contents || contents.length == 0) { 
        return def; 
      }
      var oldValue = self.preview ? self.preview() : '';
      result = self.converter().convert(contents); 
      result = result ? result : oldValue;
    } 
    return result;
  });

  self.save = function () {
    $.post('/dropbox/save', ko.toJSON(self.currentItem()))
      .success(function(returnedData) {
        console.log('Successfully saved');
      })
      .error(function(xhr, ajaxOptions, thrownError) {
        console.log("Error saving...");
        console.log(xhr.status + ": " + thrownError);
      })
      .always(function () {

      });
  };

  self.saveAs = function () {
    var item = self.currentItem();

    var name = null;
    name = prompt('Please enter a file name', null);
    if (!name || name.length == 0) { return false; }
    item.path(self.currentDir() + "/" + name);

    // This is obtrusive. Just show a gif somewhere.
    // Implement it in the Util.setLoading method. 
    // Change signature to setLoading(troo,obtrusive);
    // Default obtrusive to true to avoid changes elsewhere
    Util.setLoading(true);

    $.post('/dropbox/save', ko.toJSON(item))
      .success(function(returnedData) {
        console.log(returnedData);
      })
      .error(function(xhr, ajaxOptions, thrownError) {
        alert("Error while saving!");
        console.log("Params: " + ajaxOptions);
        console.log(xhr.status + ": " + thrownError);
      })
      .always(function () {
        Util.setLoading(false);
      });
  };

  self.browse = function () {
    self.changeDir('/');
  };

  self.upDir = function () {
    if (self.currentDir() != '/') {
      var path = self.currentDir().split('/');
      path.pop();
      path = path.length > 1 ? path.join('/') : '/';
      self.changeDir(path);
    } else {
      return false;
    }
  },

  self.changeDir = function (path) {
    viewModel.currentDir(path);
    $.getJSON('/dropbox/get/dir', { dir: path }, function (data) {
      var files = ko.utils.arrayMap(data, function (path) {
        return new DropboxItem(path);
      });
      self.files(files);
    });
  };

  self.browseItemClick = function (item) {
    if (item.isDir()) {
      self.files(undefined);
      self.changeDir(item.path());
    } else {
      self.currentItem(item);
      self.downloadFile(item);
    }
  };

  self.downloadFile = function (item) {
    Util.showFileBrowser(false);
    Util.setLoading(true);
    $.getJSON('/dropbox/get/file',{ path: item.path() }, function(data) {
      self.currentItem().contents(data.contents);
    })
    .always(function () {
      Util.setLoading(false);
    });
  };


};


////////////////////////////////////////////////////////////////
var DropboxItem = function(base,contents){
  var self = this;
  self.contents = ko.observable(contents);
  self.path = ko.observable();
  self.isDir = ko.observable(false);

  if (base) {
    self.path(base.path);
    self.isDir(base.is_dir);
  }
};

////////////////////////////////////////////////////////////////
var Converter = function (converter,name) {
  var self = this;
  self.converter = converter;
  self.name = ko.observable(name);
  self.convert = function (content) {
    var result = '';
    if (content) {
      try { result = self.converter(content); } 
      catch (e) { 
        console.log('Error converting with ' + self.name() + ' => ' + e); 
        result = false; 
      }
    }
    return result;
  };
};