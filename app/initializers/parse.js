/*global Parse*/
import ENV from 'last-man-standing/config/environment';

export function initialize(/* application */) {
  // Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
  Parse.initialize(
    ENV.APP.applicationId, // This is your Application ID
    ENV.APP.javascriptClientKey // This is your Javascript key
  );
  Parse.serverURL = ENV.APP.parseServerUrl; // This is your Server URL
}

export default {
  initialize,
};
