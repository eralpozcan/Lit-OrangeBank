import { ConfirmDialog } from '../src/components/confirm-dialog.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('confirm-dialog', () => {
  let element;

  test('is defined', () => {
    const el = document.createElement('confirm-dialog');
    assert.instanceOf(el, ConfirmDialog);
  });

  test('renders with default properties', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    assert.isFalse(element.hasAttribute('open'));
    assert.isUndefined(element.message);
    assert.isUndefined(element.isDelete);
  });

  test('is hidden by default', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    assert.isFalse(element.hasAttribute('open'));
    
    const computedStyle = getComputedStyle(element);
    assert.equal(computedStyle.display, 'none');
  });

  test('shows when open attribute is set', async () => {
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    
    assert.isTrue(element.hasAttribute('open'));
    
    const computedStyle = getComputedStyle(element);
    assert.equal(computedStyle.display, 'flex');
  });

  test('renders dialog box structure', async () => {
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    
    const box = element.shadowRoot.querySelector('.box');
    assert.exists(box);
    
    const header = element.shadowRoot.querySelector('.header');
    assert.exists(header);
    
    const content = element.shadowRoot.querySelector('.content');
    assert.exists(content);
    
    const actions = element.shadowRoot.querySelector('.actions');
    assert.exists(actions);
  });

  test('displays correct title for delete dialog', async () => {
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    element.isDelete = true;
    await element.updateComplete;
    
    const title = element.shadowRoot.querySelector('.title');
    assert.exists(title);
    assert.include(title.textContent.toLowerCase(), 'delete' || 'sil');
  });

  test('displays correct title for update dialog', async () => {
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    element.isDelete = false;
    await element.updateComplete;
    
    const title = element.shadowRoot.querySelector('.title');
    assert.exists(title);
    assert.include(title.textContent.toLowerCase(), 'save' || 'güncelle' || 'confirm');
  });

  test('displays message correctly', async () => {
    const testMessage = 'Are you sure you want to proceed?';
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    element.message = testMessage;
    await element.updateComplete;
    
    const messageElement = element.shadowRoot.querySelector('.message');
    assert.exists(messageElement);
    assert.equal(messageElement.textContent, testMessage);
  });

  test('renders correct buttons', async () => {
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    
    const primaryButton = element.shadowRoot.querySelector('.primary');
    const ghostButton = element.shadowRoot.querySelector('.ghost');
    const closeButton = element.shadowRoot.querySelector('.close-btn');
    
    assert.exists(primaryButton);
    assert.exists(ghostButton);
    assert.exists(closeButton);
  });

  test('primary button shows correct text for delete', async () => {
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    element.isDelete = true;
    await element.updateComplete;
    
    const primaryButton = element.shadowRoot.querySelector('.primary');
    assert.exists(primaryButton);
    assert.include(primaryButton.textContent.toLowerCase(), 'delete' || 'sil');
  });

  test('primary button shows correct text for save', async () => {
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    element.isDelete = false;
    await element.updateComplete;
    
    const primaryButton = element.shadowRoot.querySelector('.primary');
    assert.exists(primaryButton);
    assert.include(primaryButton.textContent.toLowerCase(), 'save' || 'kaydet');
  });

  test('confirm method returns promise', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    const confirmPromise = element.confirm('Test message');
    assert.instanceOf(confirmPromise, Promise);
    
    const cancelButton = element.shadowRoot.querySelector('.ghost');
    if (cancelButton) {
      cancelButton.click();
    }
    
    const result = await confirmPromise;
    assert.isFalse(result);
  });

  test('confirm method sets properties correctly', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    const testMessage = 'Test confirmation message';
    element.confirm(testMessage, true);
    
    assert.equal(element.message, testMessage);
    assert.isTrue(element.isDelete);
    assert.isTrue(element.hasAttribute('open'));
  });

  test('primary button click resolves with true', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    const confirmPromise = element.confirm('Test message');
    
    const primaryButton = element.shadowRoot.querySelector('.primary');
    if (primaryButton) {
      primaryButton.click();
    }
    
    const result = await confirmPromise;
    assert.isTrue(result);
    assert.isFalse(element.hasAttribute('open'));
  });

  test('cancel button click resolves with false', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    const confirmPromise = element.confirm('Test message');
    
    const cancelButton = element.shadowRoot.querySelector('.ghost');
    if (cancelButton) {
      cancelButton.click();
    }
    
    const result = await confirmPromise;
    assert.isFalse(result);
    assert.isFalse(element.hasAttribute('open'));
  });

  test('close button click resolves with false', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    const confirmPromise = element.confirm('Test message');
    
    const closeButton = element.shadowRoot.querySelector('.close-btn');
    if (closeButton) {
      closeButton.click();
    }
    
    const result = await confirmPromise;
    assert.isFalse(result);
    assert.isFalse(element.hasAttribute('open'));
  });

  test('dialog closes after resolution', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    const confirmPromise = element.confirm('Test message');
    assert.isTrue(element.hasAttribute('open'));
    
    const primaryButton = element.shadowRoot.querySelector('.primary');
    if (primaryButton) {
      primaryButton.click();
    }
    
    await confirmPromise;
    assert.isFalse(element.hasAttribute('open'));
  });

  test('multiple confirm calls work correctly', async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    const firstPromise = element.confirm('First message');
    const primaryButton = element.shadowRoot.querySelector('.primary');
    if (primaryButton) {
      primaryButton.click();
    }
    const firstResult = await firstPromise;
    assert.isTrue(firstResult);
    
    const secondPromise = element.confirm('Second message');
    const cancelButton = element.shadowRoot.querySelector('.ghost');
    if (cancelButton) {
      cancelButton.click();
    }
    const secondResult = await secondPromise;
    assert.isFalse(secondResult);
  });

  test('dialog has proper styling classes', async () => {
    element = await fixture(html`<confirm-dialog open></confirm-dialog>`);
    
    const box = element.shadowRoot.querySelector('.box');
    const header = element.shadowRoot.querySelector('.header');
    const title = element.shadowRoot.querySelector('.title');
    const content = element.shadowRoot.querySelector('.content');
    const message = element.shadowRoot.querySelector('.message');
    const actions = element.shadowRoot.querySelector('.actions');
    
    assert.exists(box);
    assert.exists(header);
    assert.exists(title);
    assert.exists(content);
    assert.exists(message);
    assert.exists(actions);
  });


});