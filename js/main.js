// no globals and run on load
(function() {
  'use strict';

  // router
  var router = (function() {
    // handle hash change
    window.addEventListener('hashchange', function(event) {
      route(event.target.location.hash);
    }, false);
    // methods
    function load() {
      route(window.location.hash);
    }
    function add(hash, func) {
      events.subscribe(hash, func)
    }
    function remove() {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    function route(hash) {
      events.publish('route-' + hash);
    }

    // public
    return {
      add: add,
      remove: remove,
      load: load
    };
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
    addCache()
    function addCache() {
      var modals = document.getElementsByClassName('modal');
      for (var i = 0; i < modals.length; i++) {
        var self = this;
        var modal = modals[i];
        var id = modal.id;
        var type = modal.classList.contains('notification') ? 'notification' : 'dialog';
        var children = modal.children;
        var background = null;
        var close = null;
        for (var j = 0; j < children.length; j++) {
          var child = children[j]
          var subchildren = child.children;
          background = (child.classList.contains('modal-background')) ? child : background;
          for (var k = 0; k < subchildren.length; k++) {
            var subchild = subchildren[k]
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
      var type = (type === 'notification') ? 'notification' : 'dialog';

      isModalOpen ? modal.classList.remove('active') : modal.className += ' active';
      if (type === 'dialog') {
        isModalOpen ? document.body.classList.remove('modal') : document.body.className += ' modal';
        isModalOpen ? router.remove() : null;
      } else if (type === 'notification') {
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

  var support = (function() {
    // <a href="#" class="contact-support" title="Contact support">Contact support</a>
    var statement = 'mailto:support@branch.io?subject=I need some assistance&body=Hello Branch Support,%0A%0AI am viewing (' + window.location.href + ').%0A%0AMy Branch Key (https%3A%2F%2Fdashboard.branch.io%2Faccount-settings%2Fapp) is:%0A%0A I need assistance with ';

    // main
    load()
    function load() {
      var supports = document.getElementsByClassName('contact-support');
      for (var i = 0; i < supports.length; i++) {
        var support = supports[i];
        support.setAttribute('href', statement);
      }
    }

    function contact() {
      window.location.href = statement;
    }

    return {
      load: load,
      contact: contact
    }
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
    var search = document.getElementById('algolia-doc-search');

    router.add('route-#header-helpful', function() {
      modal.toggle('modal-helpful', 'notification', 1500);
    });
    router.add('route-#header-unhelpful', function() {
      modal.toggle('modal-unhelpful', 'dialog');
    });
    router.add('route-#header-search', function() {
      modal.toggle('modal-search', 'dialog');
      search.focus();
    });

    analytics.track('viewed page ' + window.location.href);
    router.load();
  }
  onload();
})();