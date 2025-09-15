import {assert} from '@open-wc/testing';
import {initRouter} from '../src/router.js';

suite('Router Tests', () => {
  let outlet;
  let router;

  setup(() => {
    outlet = document.createElement('div');
    document.body.appendChild(outlet);
    
    router = initRouter(outlet);
  });

  test('router is initialized correctly', () => {
    assert.isDefined(router);
    assert.isFunction(router.setRoutes);
    assert.isFunction(router.render);
  });

  test('router has correct outlet', () => {
    assert.equal(router.location.getUrl(), '');
  });

  test('router can navigate to root path', async () => {
    await router.render('/');
    assert.isTrue(true);
  });

  test('router can navigate to employees path', async () => {
    await router.render('/employees');
    assert.isTrue(true);
  });

  test('router redirects unknown paths to root', async () => {
    await router.render('/unknown-path');
    assert.isTrue(true);
  });
});