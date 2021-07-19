export function initialize(/* application */) {
  // Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
  Parse.initialize(
    'n3mP3kHO2C683mycrV7dnyKeqaE8WH31IJtE8yEc', // This is your Application ID
    'NXIcBhTGhbMegFfrorRm8aAnZm71NLzWYTtC9Uk6' // This is your Javascript key
  );
  Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
}

export default {
  initialize,
};
