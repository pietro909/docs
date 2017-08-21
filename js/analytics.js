// analytics
'use strict';
var analytics = (function() {
  // public
  function track(event, category, action) {
    var categoryClean = category || 'none';
    var actionClean = action || 'none';
    ga('send', event, categoryClean, actionClean);
    mixpanel.track(event);
  }
  return {
    track: track
  };
})();
