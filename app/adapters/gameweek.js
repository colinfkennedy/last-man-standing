import ApplicationAdapter from './application';

export default class GameweekAdapter extends ApplicationAdapter {
  // eslint-disable-next-line no-unused-vars
  urlForFindAll(modelName, snapshot) {
    let baseUrl = this.buildURL(modelName);
    return `${baseUrl}?order=gameweekOrder`;
  }
}
