import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = 'https://parseapi.back4app.com';
  namespace = 'classes';
  headers = {
    'X-Parse-Application-Id': 'n3mP3kHO2C683mycrV7dnyKeqaE8WH31IJtE8yEc',
    'X-Parse-Client-Key': 'JuHDw0dNg7DFiYkwZgeBCXy1kZSllyxpotYWx3cs',
  };

  pathForType(type) {
    return type;
  }
}
