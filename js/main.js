// no globals
(function() {
  'use strict';

  // router
  var router = (function() {
    // listener
    window.addEventListener('hashchange', function(event) {
      // handle hash change
      _route(event.target.location.hash);
    }, false);

    // private
    function _route(hash) {
      events.publish('route-' + hash);
    }

    // public
    function init() {
      _route(window.location.hash);
    }
    function add(hash, func) {
      events.subscribe(hash, func);
    }
    function remove() {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    return {
      add: add,
      remove: remove,
      init: init
    };
  })();

  // routes
  var routes =  (function() {
    // public
    function init() {
      router.add('route-#header-helpful', function() {
        modal.toggle('modal-helpful', 'notification', 1500);
      });
      router.add('route-#header-unhelpful', function() {
        modal.toggle('modal-unhelpful', 'dialog');
      });
      router.add('route-#header-search', function() {
        modal.toggle('modal-search', 'dialog');
      });
    }
    return {
      init: init
    }
  })();

  // pub sub
  var events = (function() {
    // properties
    var events = {};
    // methods
    function publish(name, data) {
      if (events[name]) {
        events[name].forEach(function(func) {
          func(data);
        });
      }
    }
    function subscribe(name, func) {
      events[name] = events[name] || [];
      events[name].push(func);
    }
    function unsubscribe(name, func) {
      if (events[name]) {
        for (var i = 0; i < events[name].length; i++) {
          if( events[name][i] === func ) {
            events[name].splice(i, 1);
            break;
          }
        }
      }
    }
    // public
    return {
      publish: publish,
      subscribe: subscribe,
      unsubscribe: unsubscribe
    };
  })();

  // modals
  var modal = (function() {
    // properties
    var cache = {};

    // main
    addCache();
    function addCache() {
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
        addListener(id, type, background, close);
        cache[id] = modal;
      }
    }

    function addListener(id, type, background, close) {
      // need separate function because of closure binding within .addEventListener
      close.addEventListener('click', function(event) {
        toggle(id, type);
      });
      if (type === 'notification') return;
      background.addEventListener('click', function(event) {
        toggle(id, type);
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
      toggle: toggle
    };
  })();

  var buttons = (function() {
    // properties
    var buttons = {
      support: {
        url: _getSupportUrl(),
        buttons: document.getElementsByClassName('contact-support'),
        example: '<a href="#" class="contact-support" title="Contact support">Contact support</a>',
      },
      improve: {
        url: _getImproveUrl(),
        buttons: document.getElementsByClassName('improve-doc'),
        example: '<a href="#" class="improve-doc" title="Improve This Doc">Improve this docs</a>',
      }
    }

    // private
    function _getSupportUrl() {
      return 'mailto:integration@branch.io?subject=I need some assistance&body=Hello Branch,%0A%0AI am viewing (' + window.location.href + ').%0A%0AMy Branch Key (https%3A%2F%2Fdashboard.branch.io%2Faccount-settings%2Fapp) is:%0A%0A I need assistance with '
    }
    function _getImproveUrl() {
      var trim = window.location.pathname.replace(/^\/|\/$/g, '').split('/');
      trim = trim[0] === 'docs' ? trim.slice(1, trim.length).join('/') : trim.join('/');
      var path = (trim === '') ? '/index' : trim;
      return 'https://github.com/branchmetrics/docs/edit/master/src/' + path + '.md';
    }

    // public
    function init() {
      for (var key1 in buttons) {
        var button = buttons[key1];
        for (var key2 in button) {
          var value = button[key2];
          if (key2 === 'buttons') {
            for (var i = 0; i < value.length; i++) {
              var element = value[i];
              element.setAttribute('href', button.url);
            }
          }
        }
      }
    }
    function contact(button) {
      window.location.href = buttons.button.url;
    }
    return {
      init: init,
      contact: contact
    };
  })();

  // analytics
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

  // page load
  function onload() {
    analytics.track('viewed page ' + window.location.href);
    routes.init();
    buttons.init();
    router.init();
  }
  onload();
})();