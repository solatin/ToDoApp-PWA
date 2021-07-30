/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-env es6 */
/* eslint no-unused-vars: 0 */

const CACHE_NAME = 'lib-stuff-v1';
const PRECACHE_RESOURCE = ['/', '/sw.js'];

/* global importScripts, ServiceWorkerWare, localforage */
importScripts('./lib/ServiceWorkerWare.js');
importScripts('./lib/localforage.js');

var worker = new ServiceWorkerWare();
const ENDPOINT_LIST = 'http://192.168.1.107:3030/todos/';
const ENDPOINT = 'http://192.168.1.107:3030/';
const root = 'http://localhost:3000/';

let REQUEST_LIST = null;

var SimpleWare = {
  onInstall: () => {
    console.log('Install event!');
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_RESOURCE);
    });
  },
  onActivate: async () => {
    console.log('Ativate event!');
    self.clients.claim();
    const keys = await caches.keys();
    return Promise.all(keys.map((key) => key !== CACHE_NAME? caches.delete(key) : null));
  },

  onMessage:  (evt) => {
    console.log('On message called!!');
  },
};

worker.use(SimpleWare);

worker.delete(
  ENDPOINT + 'todos/:id?*',
  async (req, res) => {
    if (!navigator.onLine) {
      console.log('No network availability, enqueuing');
      const clone_req = req.clone();
      const list_response = await caches.open(CACHE_NAME).then(cache => cache.match(REQUEST_LIST));

      const list = await list_response.json();
      const [id] = clone_req.url.split('/').slice(-1);
      const new_list = list.filter(todo => todo.id !== +id);
      
      const blob = new Blob([JSON.stringify(new_list, null, 2)], {type : 'application/json'});
      const init = {status: 202};
      const new_res = new Response(blob, init);
      await caches.open(CACHE_NAME).then((cache) => cache.put(REQUEST_LIST, new_res));

      return enqueue(req).then(function () {
        return new Response(null, {status: 202,}).clone();
      });
    }
    
    console.log('Network available! Flushing queue.');
    return flushQueue().then(function () {
      return fetch(req);
    });
  }
);

worker.post(
  ENDPOINT + 'todos?*',
  async (req, res) => {
    if (!navigator.onLine) {
      console.log('No network availability, enqueuing');
      const clone_req = req.clone();
      const list_response = await caches.open(CACHE_NAME).then(cache => cache.match(REQUEST_LIST));

      const list = await list_response.json();
      const newTodo = await clone_req.json();
      const new_list = [...list, newTodo];
      
      const blob = new Blob([JSON.stringify(new_list, null, 2)], {type : 'application/json'});
      const init = {status: 202};
      const new_res = new Response(blob, init);
      await caches.open(CACHE_NAME).then((cache) => cache.put(REQUEST_LIST, new_res));

      return enqueue(req).then(function () {
        return new Response(null, {status: 202,}).clone();
      });
    }
    
    console.log('Network available! Flushing queue.');
    return flushQueue().then(function () {
      return fetch(req);
    });
  }
);

worker.put(
  ENDPOINT + 'todos/', async (req, res) => {
    if (!navigator.onLine) {
      console.log('No network availability, enqueuing');
      const clone_req = req.clone();
      const list_response = await caches.open(CACHE_NAME).then(cache => cache.match(REQUEST_LIST));

      const list = await list_response.json();
      const newTodo = await clone_req.json();
      const new_list = list.map(todo => todo.id === newTodo.id ? {...todo, ...newTodo} : todo);
      
      const blob = new Blob([JSON.stringify(new_list, null, 2)], {type : 'application/json'});
      const init = {status: 202};
      const new_res = new Response(blob, init);
      await caches.open(CACHE_NAME).then((cache) => cache.put(REQUEST_LIST, new_res));

      return enqueue(req).then(function () {
        return new Response(null, {status: 202,}).clone();
      });
    }
    
    console.log('Network available! Flushing queue.');
    return flushQueue().then(function () {
      return fetch(req);
    });
  }
);

worker.put(
  ENDPOINT + 'clear-completed?*', async (req, res) => {
    if (!navigator.onLine) {
      console.log('No network availability, enqueuing');

      const list_response = await caches.open(CACHE_NAME).then(cache => cache.match(REQUEST_LIST));
      const list = await list_response.json();
      const new_list = list.filter(todo => !todo.completed);
      
      const blob = new Blob([JSON.stringify(new_list, null, 2)], {type : 'application/json'});
      const init = {status: 202};
      const new_res = new Response(blob, init);
      await caches.open(CACHE_NAME).then((cache) => cache.put(REQUEST_LIST, new_res));

      return enqueue(req).then(function () {
        return new Response(null, {status: 202,}).clone();
      });
    }
    

    console.log('Network available! Flushing queue.');
    return flushQueue().then(function () {
      return fetch(req);
    });
  }
);

worker.get('*', async (req, res) => {
  if (req.url === ENDPOINT_LIST && !REQUEST_LIST) {
    REQUEST_LIST = req.clone();
  }
  //offline
  if (!navigator.onLine) {
    //return cache response
    console.log('offline')
    const cacheResponse = await caches.open(CACHE_NAME).then((cache) => cache.match(req));
    if (cacheResponse) {
      console.log('cacheResponse', cacheResponse);
      return cacheResponse;
    }
    //no cache response, enqueued request
    await enqueue(req);
    return new Response(
      JSON.stringify([
        {
          text: 'You are offline! Enqueued your request',
        },
      ]),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }
  //online
  return flushQueue().then(function () {
    return fromNetwork(req, 1000).catch(() => fromCache(req));
  });
});


worker.init();

const fromNetwork = (request, timeout) =>
  new Promise((fulfill, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      fulfill(response.clone());
      if (request.method === 'GET') {
        caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
      }
    }, reject);
  });

const fromCache = (request) =>
  caches
    .open(CACHE_NAME)
    .then((cache) => cache.match(request).then((matching) => matching));

function enqueue(request) {
  return serialize(request).then(function (serialized) {
    localforage.getItem('queue').then(function (queue) {
      /* eslint no-param-reassign: 0 */
      queue = queue || [];
      queue.push(serialized);
      return localforage.setItem('queue', queue).then(function () {
        console.log(serialized.method, serialized.url, 'enqueued!');
      });
    });
  });
}

function flushQueue() {
  // Get the queue
  return localforage.getItem('queue').then(function (queue) {
    /* eslint no-param-reassign: 0 */
    queue = queue || [];

    if (!queue.length) {
      return Promise.resolve();
    }

    console.log('Sending ', queue.length, ' requests...');
    return sendInOrder(queue).then(function () {
      return localforage.setItem('queue', []);
    });
  });
}

function sendInOrder(requests) {
  var sending = requests.reduce(function (prevPromise, serialized) {
    console.log('Sending', serialized.method, serialized.url);
    return prevPromise.then(function () {
      return deserialize(serialized).then(function (request) {
        return fetch(request);
      });
    });
  }, Promise.resolve());
  return sending;
}

function serialize(request) {
  let headers = {};
  for (let entry of request.headers.entries()) {
    headers[entry[0]] = entry[1];
  }
  let serialized = {
    url: request.url,
    headers: headers,
    method: request.method,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return request
      .clone()
      .text()
      .then(function (body) {
        serialized.body = body;
        return Promise.resolve(serialized);
      });
  }
  return Promise.resolve(serialized);
}

function deserialize(data) {
  return Promise.resolve(new Request(data.url, data));
}
