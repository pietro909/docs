// modals
'use strict';
var modals = (function() {
  // properties
  var cache = {};

  // main
  _addCache();
  function _addCache() {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
      var modal = modals[i];
      var id = modal.id;
      var type = modal.classList.contains('notification') ? 'notification' : 'dialog';
      var children = modal.children;
      var background = null;
      var close = null;
      for (var j = 0; j < children.length; j++) {
        var child = children[j];
        var subchildren = child.children;
        background = (child.classList.contains('modal-background')) ? child : background;
        for (var k = 0; k < subchildren.length; k++) {
          var subchild = subchildren[k];
          close = (subchild.classList.contains('modal-close')) ? subchild : close;
          break;
        }
      }
      _addListener(id, type, background, close);
      cache[id] = modal;
    }
  }

  function _addListener(id, type, background, close) {
    // need separate function because of closure binding within .addEventListener
    close.addEventListener('click', function(event) {
      toggle(id, type);
    });
    if (type === 'notification') return;
    background.addEventListener('click', function(event) {
      toggle(id, type);
    });
  }

  function route() {
    var search = document.getElementById('algolia-doc-search');
    router.add('#dialog-helpful', function() {
      analytics.track('viewed modal helpful');
      modals.toggle('modal-helpful', 'notification', 1500);
    });
    router.add('#dialog-unhelpful', function() {
      analytics.track('viewed modal unhelpful');
      modals.toggle('modal-unhelpful', 'dialog');
    });
    router.add('#dialog-search', function() {
      analytics.track('viewed modal search');
      modals.toggle('modal-search', 'dialog');
      search.focus();
    });
  }

  function toggle(id, type, duration) {
    var modal = cache[id];
    if (!modal) return;
    var isModalOpen = modal.classList.contains('active');
    var time = (duration) ? duration : 0;
    var types = (type === 'notification') ? 'notification' : 'dialog';

    isModalOpen ? modal.classList.remove('active') : modal.className += ' active';
    if (types === 'dialog') {
      isModalOpen ? document.body.classList.remove('modal') : document.body.className += ' modal';
      isModalOpen ? router.remove() : null;
    } else if (types === 'notification') {
      setTimeout(function() {
        modal.classList.remove('active');
        router.remove();
      }, time);
    }
  }

  // public
  return {
    toggle: toggle,
    route: route
  };
})();