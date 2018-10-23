var cacheName='lzyVr-1::fundamentals';

function preCache() {
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/?referrer=homescreen',
        '/assets/styles/main.css',
        '/assets/scripts/main.js',
        '/assets/scripts/main__daisy.js',
        '/loading.gif',
        '/manifest.json',
      ]);
    }).then(function() {
      return self.skipWaiting();
    });
}

function eitherCacheOrNet(request) {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(request).then(function(matching) {
        return matching || fetch(request).then(function(response) {
            return response;
        });
    });
  });
}

function fromCacheOrNet(request) {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(request).then(function(matching) {
        return matching || fetch(request).then(function(response){
            if(response.ok) { cache.put(request,response.clone()); }
            return response;
        });
    });
  });
}

function fromNetOrCache(request) {
  return caches.open(cacheName).then(function(cache) {
    return fetch(request).then(function(response) {
      if(response.ok) { cache.put(request, response.clone()); }
      return response;
    }).catch(function() {
        return cache.match(request).then(function(matching) {
            return matching;
        });
    });
  });
}

function update(request) {
  return caches.open(cacheName).then(function(cache) {
    return fetch(request).then(function(response) {
      if(response.ok) cache.put(request, response.clone());
      return response;
    });
  });
}

function refresh(response) {
  return self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      var message = {
        type: 'refresh',
        url: response.url,
        lMd: response.headers.get('Last-Modified')
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(preCache());
});

self.addEventListener('fetch', function(event) {
  var url=new URL(event.request.url), pathname=url.pathname, hostname=url.hostname, headers=event.request.headers;
  if(event.request.method !== 'GET'||(event.request.cache==='only-if-cached'&&event.request.mode!=='same-origin')||(url.origin!=self.origin&&hostname!=='daisy-oreo.tech'&&hostname!=='68.66.242.35')) return;
  else if(/\.(jpe?g|png|gif)$/i.test(pathname)) event.respondWith(eitherCacheOrNet(event.request));
  else if(/\.(js(on)?|css)$/i.test(pathname)||/^\/([\w-]+)?$/i.test(pathname)) event.respondWith(fromCacheOrNet(event.request));
  else event.respondWith(fromNetOrCache(event.request));
  if(/\.(js(on)?|css)$/i.test(pathname)) event.waitUntil(update(event.request));
  else if(/^\/[\w-]+$/i.test(pathname)) event.waitUntil(update(event.request).then(refresh));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return !key.startsWith(version)&&!key.startsWith('audio');
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

function notify(title,options,click,error) {
    if(!options) options={};
    // if(!options.icon) options.icon='/assets/images/icon.png';
    if(!options.lang) options.lang='EN';
    if(!click||typeof click !== 'function') click=function() { console.log('clicked'); };
    if(!error||typeof error !== 'function') error=function() { console.log('error occured'); };
    var Not=window.Notification||window.webkitNotification||window.mozNotification;
    if(!Not) return;
    function toNot() { var not=new Not(title,options); not.onclick=click; not.onerror=error; }
    if(Not.permission==='granted') toNot();
    else if(Not.permission!=='denied') { Not.requestPermission(function(resp) {
        if(resp==='granted') toNot();
    }); }
}
