import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('fixture', {
  sequences: {
    fixtureDay: (num) => `2${num}`,
  },

  default: {
    kickoff: new Date(
      `August ${FactoryGuy.generate('fixtureDay')}, 2021 15:00:00`
    ),
  },
});