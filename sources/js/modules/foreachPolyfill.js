// https://stackoverflow.com/questions/44652092/ie-doesnt-support-foreach-even-with-polyfill
(function() {
  if (typeof NodeList.prototype.forEach === 'function') return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();
