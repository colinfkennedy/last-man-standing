import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('babber', {
  sequences: {
    babberName: (num) => `Babber ${num}`,
  },

  default: {
    name: FactoryGuy.generate('babberName'),
  },
});
