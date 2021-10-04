import Notification from './Notification';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      Notification.init(registration);
      console.log('ServiceWorker registration successful with scope: ', registration);
    })
    .catch((err) => {
      console.log('ServiceWorker registration failed: ', err);
    });
} else {
  console.warn('Push messaging is not supported');
}
