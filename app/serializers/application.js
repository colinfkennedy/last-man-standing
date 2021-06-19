import JSONSerializer from '@ember-data/serializer/json';

export default class ApplicationSerializer extends JSONSerializer {
  primaryKey = 'objectId';

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    return super.normalizeArrayResponse(
      store,
      primaryModelClass,
      payload.results,
      id,
      requestType
    );
  }

  normalizeCreateRecordResponse(store, primaryModelClass, payload, id, requestType) {
    return super.normalizeCreateRecordResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }

  normalize(typeClass, hash) {
    hash['type'] = typeClass.modelName;
    return super.normalize(...arguments);
  }
}
