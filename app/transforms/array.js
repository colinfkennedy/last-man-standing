import Transform from '@ember-data/serializer/transform';

export default class ArrayTransform extends Transform {
  deserialize(serialized) {
    if (!serialized) {
      return [];
    }
    return serialized;
  }

  serialize(deserialized) {
    return deserialized;
  }
}
