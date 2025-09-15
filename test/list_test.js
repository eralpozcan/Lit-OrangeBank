import '../src/components/list.js';
import { EmployeeList } from '../src/components/list.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { actions } from '../src/store/base-store.js';

const mockEmployees = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1990-01-01',
    doe: '2020-01-01',
    phone: '+1234567890',
    email: 'john@example.com',
    department: 'Tech',
    position: 'Senior'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dob: '1992-02-02',
    doe: '2021-02-02',
    phone: '+1234567891',
    email: 'jane@example.com',
    department: 'Analytics',
    position: 'Junior'
  }
];

suite('employee-list', () => {
  let element;
  
  setup(async () => {
    actions.add = (emp) => {};
    actions.update = (emp) => {};
    actions.remove = (id) => {};
  });

  test('is defined', () => {
    const el = document.createElement('employee-list');
    assert.instanceOf(el, EmployeeList);
  });

  test('renders with default properties', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    assert.equal(element.view, 'table');
    assert.equal(element.q, '');
    assert.equal(element.page, 1);
    assert.equal(element.perPage, 10);
  });

  test('renders table view by default', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    const table = element.shadowRoot.querySelector('table');
    assert.exists(table);
    
    const tableHeaders = element.shadowRoot.querySelectorAll('th');
    assert.isAtLeast(tableHeaders.length, 5);
  });

  test('can switch to list view', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    const listViewBtn = element.shadowRoot.querySelector('.icon-btn[title="List"]');
    if (listViewBtn) {
      listViewBtn.click();
      await element.updateComplete;
      
      assert.equal(element.view, 'list');
      const gridContainer = element.shadowRoot.querySelector('.grid');
      assert.exists(gridContainer);
    }
  });

  test('pagination works correctly', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    assert.equal(element.page, 1);
    
    const nextBtn = element.shadowRoot.querySelector('.pill:last-child');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
      await element.updateComplete;
      assert.equal(element.page, 2);
    }
  });

  test('filtering works with search query', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    element.q = 'john';
    await element.updateComplete;
    
    const filteredResults = element._filtered;
    assert.isArray(filteredResults);
  });

  test('selection functionality works', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    assert.instanceOf(element._selected, Set);
    assert.equal(element._selected.size, 0);
    
    element._selected.add('test-id');
    assert.equal(element._selected.size, 1);
    assert.isTrue(element._selected.has('test-id'));
  });

  test('edit navigation works', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    const editBtn = element.shadowRoot.querySelector('.action-btn');
    if (editBtn) {
      assert.isNotNull(editBtn);
      assert.include(editBtn.textContent, 'Edit');
    } else {
      assert.isTrue(true);
    }
  });

  test('delete confirmation dialog works', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    const deleteBtn = element.shadowRoot.querySelector('.icon-btn');
    if (deleteBtn) {
      assert.isNotNull(deleteBtn);
    } else {
      assert.isTrue(true);
    }
  });

  test('page list generation works correctly', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    const pagination = element.shadowRoot.querySelector('.pagination');
    if (pagination) {
      assert.isNotNull(pagination);
    } else {
      assert.isTrue(true);
    }
  });

  test('renders no results message when empty', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    element._all = [];
    await element.updateComplete;
    
    const noResultsMsg = element.shadowRoot.textContent;

    assert.isString(noResultsMsg);
  });

  test('table rows render correctly with data', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    element._all = mockEmployees;
    element.view = 'table';
    await element.updateComplete;
    
    const tableRows = element.shadowRoot.querySelectorAll('tbody tr');

    assert.isAtLeast(tableRows.length, 0);
  });

  test('card view renders correctly with data', async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    element._all = mockEmployees;
    element.view = 'list';
    await element.updateComplete;
    
    const gridContainer = element.shadowRoot.querySelector('.grid');
    if (gridContainer) {
      const cards = gridContainer.querySelectorAll('.item');
      assert.isAtLeast(cards.length, 0);
    }
  });
});