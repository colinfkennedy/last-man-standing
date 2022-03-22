'use strict';

module.exports = {
  singleQuote: true,
  overrides: [
      {
          "files": ["**/*.css", "**/*.scss", "**/*.html", "**/*.hbs"],
          "options": {
              "singleQuote": false
          }
      }
  ]
}
};
