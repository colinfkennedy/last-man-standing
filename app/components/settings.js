import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import toUint8Array from 'urlb64touint8array';

export default class SettingsComponent extends Component {
  @tracked notificationsEnabled = false;

  enableNotifications() {
    if (!('serviceWorker' in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      return;
    }

    if (!('PushManager' in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      return;
    }
    this.registerServiceWorker();
  }

  registerServiceWorker() {
    return navigator.serviceWorker
      .register('/service-worker.js')
      .then(function (registration) {
        console.log('Service worker successfully registered.');
        return registration;
      })
      .catch(function (err) {
        console.error('Unable to register service worker.', err);
      });
  }

  askPermission() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error("We weren't granted permission.");
      }
    });
  }

  subscribeUserToPush() {
    return navigator.serviceWorker
      .register('/service-worker.js')
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: toUint8Array(
            'BGtRWQIUJvinDNB58V8uEWXiA00IumFstsL0Xu458WALk2AWoHun5ZwCe2Oob14i__NWWqhvkDnUNfTdgu2TadQ'
          ),
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function (pushSubscription) {
        console.log(
          'Received PushSubscription: ',
          JSON.stringify(pushSubscription)
        );
        return pushSubscription;
      });
  }

  @action
  setNotifications(event) {
    if (event.target.checked) {
      console.log('Enable notifications');
      this.enableNotifications();
    } else {
      console.log('Disable notifications');
    }
  }
}
