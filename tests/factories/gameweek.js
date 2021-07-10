import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('gameweek', {
  default: {
    label: FactoryGuy.generate((num) => `${num}`),
  },

  traits: {
    withFixtures: {
      fixtures: FactoryGuy.hasMany('fixture', 2),
    },
  },
});
