// import './indexDb';
// import Notification from './notification';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      return registration.pushManager.getSubscription().then(async function (subscription) {
        if (subscription) {
          return subscription;
        }

        // Get the server's public key
        const response = await fetch('http://192.168.1.107:3030/notifs/vapidPublicKey');
        const vapidPublicKey = await response.text();
        // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
        // urlBase64ToUint8Array() is defined in /tools.js
        // const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        const convertedVapidKey = vapidPublicKey;

        // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
        // send notifications that don't have a visible effect for the user).
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      });
    })
    .then(
      function (subscription) {
        // Send the subscription details to the server using the Fetch API.
        fetch('http://192.168.1.107:3030/notifs/register', {
          method: 'post',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            subscription: subscription,
          }),
        });
        console.log('ServiceWorker registration successful with scope: ', subscription);
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      },
    );
} else {
  console.warn('Push messaging is not supported');
}

