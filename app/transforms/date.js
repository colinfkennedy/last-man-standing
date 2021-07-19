import Transform from '@ember-data/serializer/transform';

export default class DateTransform extends Transform {
  deserialize(serialized) {
    if (!serialized) {
      return null;
    }
    let date = new Date(serialized.iso);
    return date;
  }

  serialize(deserialized) {
    if (!deserialized) {
      return null;
    }

    return {
      __type: 'Date',
      iso: deserialized.toISOString(),
    };
  }
}
