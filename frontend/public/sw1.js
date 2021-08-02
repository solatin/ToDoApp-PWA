/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-env es6 */
/* eslint no-unused-vars: 0 */

const CACHE_NAME = 'lib-stuff-v1';
const PRECACHE_RESOURCE = ['/', '/sw.js'];

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.text() : 'no payload';
  event.waitUntil(
    self.registration.showNotification('Sol Server', {
      body: payload,
    }),
  );
});

self.addEventListener('notificationclick', function (event) {
  console.dir(event);
  event.waitUntil(
    clients
      .matchAll()
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == 'http://localhost:3000/' && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('http://localhost:3000/');
        }
      }),
  );
});
