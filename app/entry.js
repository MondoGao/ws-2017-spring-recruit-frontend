require('lib-flexible');
window.addEventListener('load', function () {
  require('./js/index');
  setTimeout(function () {
    document.getElementById('loading').classList.add('hide');
  }, 500);
});
