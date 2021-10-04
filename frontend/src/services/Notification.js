import authAxios from '../utils/authAxios';
class Notification {
  constructor() {
    this.serviceWorker = null;
    this.url = `${process.env.REACT_APP_SERVER_URL}/notifs`;
    this.vapidPublicKey = null;
  }

  init = (reg) => {
    this.serviceWorker = reg;
  }

  subscribe = async () => {
    if(!this.serviceWorker) return;
    let subscription = await this.serviceWorker.pushManager.getSubscription();
    if (!subscription) {
      const response = await authAxios.get(`${this.url}/vapidPublicKey`);
      // this.vapidPublicKey = await response.text();
      this.vapidPublicKey = response;
      subscription = await this.serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.vapidPublicKey
      });
    }
    await authAxios({
      url: `${this.url}/register`, 
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      data: JSON.stringify({
        subscription,
      }),
    });
  };
  unsubscribe = async() => {
    const subscription = await this.serviceWorker.pushManager.getSubscription();
    if(!subscription) return;
    await subscription.unsubscribe();
    await authAxios({
      url: `${this.url}/unregister`, 
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      data: JSON.stringify({
        subscription,
      }),
    });
    this.vapidPublicKey = null;
  }
}

const instance = new Notification();
// Object.freeze(instance);
export default instance;
