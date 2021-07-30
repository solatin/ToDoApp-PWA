// import './indexDb';
// import Notification from './notification';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    // const notification = Notification.init(registration);
    // notification.subscribe();
    console.log('ServiceWorker registration successful with scope: ', registration);
  }, (err) => {
    console.log('ServiceWorker registration failed: ', err);
  });
} else {
  console.warn('Push messaging is not supported');
}
