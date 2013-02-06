var Util = {
  setActiveNav: function () {
    $('.nav a').each(function() {
      if ($(this).attr('href')  ===  window.location.pathname) {
        $(this).closest('li').addClass('active');
      }
    });
  },

  basename: function (path) {
    if (path) {
      return path.replace(/\\/g,'/').replace( /.*\//, '' );
    } else {
      return '';
    }
  },

  dirname: function (path) {
    if (path) {
      return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');;
    } else {
      return '';
    }
  },

  setLoading: function (troo) {
    if (troo) {
      $('#loading_modal').modal({ backdrop: 'static', keyboard: false });
    } else {
      $('#loading_modal').modal('hide');
    }
  },

  showFileBrowser: function (troo) {
    if (troo) {
      $('#file_browser').modal({ backdrop: 'static', keyboard: true });
    } else {
      $('#file_browser').modal('hide');
    }
  },

  flashMessage: function(msg, closeInMs, messageType) {
    messageType = messageType ? messageType : 'info';
    var id = closeInMs ? Date.now().toString() : '';
    var html = '<div id="' + id + '" class="alert fade in alert-' + messageType + '">\
      <button type="button" class="close" data-dismiss="alert">&times;</button>' + msg + '</div>'

    $('#flash-messages').append(html);

    if (closeInMs) {
      window.setTimeout(function() {
        $('#' + id).alert('close');
      }, closeInMs);
    }
  },

}
