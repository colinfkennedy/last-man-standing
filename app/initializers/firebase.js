import ENV from 'last-man-standing/config/environment';
import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: ENV.APP.firebaseApiKey,
  authDomain: `${ENV.APP.firebaseProjectId}.firebaseapp.com`,
  databaseURL: `https://${ENV.APP.firebaseProjectId}.firebaseio.com`,
  projectId: ENV.APP.firebaseProjectId,
  storageBucket: `${ENV.APP.firebaseProjectId}.appspot.com`,
  messagingSenderId: '37171653739',
  appId: '1:37171653739:web:9ecce4f68da6e9239a952e',
  measurementId: 'G-VPK3VBNYK1',
};

export function initialize(/* application */) {
  firebase.initializeApp(firebaseConfig);
}

export default {
  initialize,
};
