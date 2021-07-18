import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { assign } from '@ember/polyfills';
import ENV from 'last-man-standing/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = 'https://parseapi.back4app.com';
  namespace = 'classes';
  headers = {
    'X-Parse-Application-Id': ENV.APP.application_id,
    'X-Parse-Client-Key': ENV.APP.client_key,
  };

  pathForType(type) {
    return type;
  }

  createRecord(store, type, snapshot) {
    let url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

    const data = this.serializeIntoHash(store, type, snapshot);

    return new Promise((resolve, reject) => {
      this.ajax(url, 'POST', { data }).then(
        (json) => {
          // This is the essential bit - merge response data onto existing data.
          resolve(assign(data, json));
        },
        (reason) => {
          reject(reason.responseJSON);
        }
      );
    });
  }

  updateRecord(store, type, snapshot) {
    const data = this.serializeIntoHash(store, type, snapshot);

    let url = this.buildURL(
      type.modelName,
      snapshot.id,
      snapshot,
      'updateRecord'
    );
    return new Promise((resolve, reject) => {
      this.ajax(url, 'PUT', { data }).then(
        (json) => {
          // This is the essential bit - merge response data onto existing data.
          resolve(assign(data, json));
        },
        (reason) => {
          reject(reason.responseJSON);
        }
      );
    });
  }

  serializeIntoHash(
    store,
    modelClass,
    snapshot,
    options = { includeId: true }
  ) {
    const serializer = store.serializerFor(modelClass.modelName);

    if (typeof serializer.serializeIntoHash === 'function') {
      const data = {};
      serializer.serializeIntoHash(data, modelClass, snapshot, options);
      return data;
    }

    return serializer.serialize(snapshot, options);
  }
}
