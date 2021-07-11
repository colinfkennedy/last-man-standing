import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('club', {
  default: {
    name: FactoryGuy.generate((num) => `Club ${num}`),
  },
});
