import ApplicationAdapter from './application';

export default class SelectionAdapter extends ApplicationAdapter {
  // eslint-disable-next-line no-unused-vars
  urlForFindAll(modelName, snapshot) {
    let baseUrl = this.buildURL(modelName);
    return `${baseUrl}?limit=10000`;
  }
}
