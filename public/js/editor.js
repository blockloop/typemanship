$(function () {
  window.viewModel = new EditorViewModel(window.serverData);
  ko.applyBindings(window.viewModel);

});
