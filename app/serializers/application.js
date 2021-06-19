import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  primaryKey = 'objectId';

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload.data = payload.results;
    delete payload.results;
    payload.data.forEach((model) => {
      model['type'] = primaryModelClass.modelName;
    });
    return super.normalizeResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }
}
