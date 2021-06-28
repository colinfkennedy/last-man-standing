import JSONSerializer from '@ember-data/serializer/json';
import { isNone } from '@ember/utils';

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

  normalizeCreateRecordResponse(
    store,
    primaryModelClass,
    payload,
    id,
    requestType
  ) {
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

  serializeBelongsTo(snapshot, json, relationship) {
    let key = relationship.key;
    let belongsToId = snapshot.belongsTo(key, { id: true });

    if (belongsToId) {
      json[key] = {
        __type: 'Pointer',
        className: relationship.type,
        objectId: belongsToId,
      };
    }
  }

  extractRelationships(modelClass, resourceHash) {
    let relationships = {};

    modelClass.eachRelationship((key, relationshipMeta) => {
      let relationship = null;
      let relationshipKey = this.keyForRelationship(
        key,
        relationshipMeta.kind,
        'deserialize'
      );
      if (resourceHash[relationshipKey] !== undefined) {
        let data = null;
        let relationshipHash = resourceHash[relationshipKey];
        if (relationshipMeta.kind === 'belongsTo') {
          data = { id: relationshipHash.objectId, type: relationshipMeta.type };
        } else if (relationshipMeta.kind === 'hasMany') {
          if (!isNone(relationshipHash)) {
            data = new Array(relationshipHash.length);
            for (let i = 0, l = relationshipHash.length; i < l; i++) {
              let item = relationshipHash[i];
              data[i] = { id: item.objectId, type: relationshipMeta.type };
            }
          }
        }
        relationship = { data };
      }

      if (relationship) {
        relationships[key] = relationship;
      }
    });
    return relationships;
  }
}
