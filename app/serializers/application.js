import JSONSerializer from '@ember-data/serializer/json';

export default class ApplicationSerializer extends JSONSerializer {
  primaryKey = 'objectId';

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    return super.normalizeResponse(
      store,
      primaryModelClass,
      payload.results,
      id,
      requestType
    );
  }

  normalize(typeClass, hash) {
    hash['type'] = typeClass.modelName;
    return super.normalize(...arguments);
  }
}
