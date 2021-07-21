import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | admin/babber', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Admin::Babber />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Admin::Babber>
        template block text
      </Admin::Babber>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
