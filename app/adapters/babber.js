import ApplicationAdapter from './application';

export default class BabberAdapter extends ApplicationAdapter {
  namespace = '';

  // eslint-disable-next-line no-unused-vars
  urlForFindAll(modelName, snapshot) {
    let baseUrl = this.buildURL(modelName);
    return `${baseUrl}?order=name`;
  }

  pathForType() {
    return 'users';
  }
}
