import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('game', {
  default: {
    label: FactoryGuy.generate((num) => `Game ${num}`),
  },
});
