// router
'use strict';
var utils = (function() {
  function readQueryString(key) {
    var clean = key.replace(/[\[\]]/g, "\\$&");
    var url = window.location.href;
    var regex = new RegExp("[?&]" + clean + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results || !results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  return {
    readQueryString: readQueryString
  };
})();