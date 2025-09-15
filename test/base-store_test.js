import { getState, subscribe, actions, getters } from '../src/store/base-store.js';
import { assert } from '@open-wc/testing';

class MockStorage {
  constructor() {
    this.data = {};
  }

  getItem(key) {
    return this.data[key] || null;
  }

  setItem(key, value) {
    this.data[key] = value;
  }

  removeItem(key) {
    delete this.data[key];
  }

  clear() {
    this.data = {};
  }
}

suite('base-store', () => {
  let mockLocalStorage;

  setup(() => {
    mockLocalStorage = new MockStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    mockLocalStorage.clear();
    const currentState = getState();
    currentState.employees = [];
  });

  test('getState returns current state', () => {
    const state = getState();
    assert.isObject(state);
    assert.isArray(state.employees);
  });

  test('subscribe adds listener', () => {
    let called = false;
    const unsubscribe = subscribe(() => {
      called = true;
    });
    
    actions.add({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '1111111111', department: 'IT', position: 'Developer' });
    
    assert.isTrue(called);
    unsubscribe();
  });

  test('actions.add adds employee', () => {
    const employee = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1111111111',
      department: 'IT',
      position: 'Developer'
    };
    
    actions.add(employee);
    
    const state = getState();
    assert.equal(state.employees.length, 1);
    assert.deepEqual(state.employees[0], employee);
  });

  test('actions.update updates employee', () => {
    const employee = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1111111111',
      department: 'IT',
      position: 'Developer'
    };
    
    actions.add(employee);
    
    const updated = { ...employee, firstName: 'Johnny' };
    actions.update(updated);
    
    const found = getters.findById(employee.id);
    assert.equal(found.firstName, 'Johnny');
  });

  test('actions.remove removes employee', () => {
    const employee = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1111111111',
      department: 'IT',
      position: 'Developer'
    };
    
    actions.add(employee);
    actions.remove(employee.id);
    
    const state = getState();
    assert.equal(state.employees.length, 0);
    
    const found = getters.findById(employee.id);
    assert.isUndefined(found);
  });

  test('getters.findById finds employee by id', () => {
    const employee = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1111111111',
      department: 'IT',
      position: 'Developer'
    };
    
    actions.add(employee);
    
    const found = getters.findById(employee.id);
    assert.deepEqual(found, employee);
  });

  test('getters.emailExists checks email uniqueness', () => {
    const employee = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1111111111',
      department: 'IT',
      position: 'Developer'
    };
    
    actions.add(employee);
    
    assert.isTrue(getters.emailExists('john@example.com'));
    assert.isFalse(getters.emailExists('jane@example.com'));
  });

  test('getters.phoneExists checks phone uniqueness', () => {
    const employee = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1111111111',
      department: 'IT',
      position: 'Developer'
    };
    
    actions.add(employee);
    
    assert.isTrue(getters.phoneExists('1111111111'));
    assert.isFalse(getters.phoneExists('2222222222'));
  });

  test('multiple actions work together', () => {
    // Add multiple employees
    const emp1 = { id: 'test-id-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '1111111111', department: 'IT', position: 'Developer' };
    const emp2 = { id: 'test-id-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '2222222222', department: 'HR', position: 'Manager' };
    
    actions.add(emp1);
    actions.add(emp2);
    
    let state = getState();
    assert.equal(state.employees.length, 2);
    
    // Update one employee
    const updatedEmp1 = { ...emp1, firstName: 'Johnny' };
    actions.update(updatedEmp1);
    
    state = getState();
    const found = getters.findById(emp1.id);
    assert.equal(found.firstName, 'Johnny');
    
    // Remove one employee
    actions.remove(emp2.id);
    
    state = getState();
    assert.equal(state.employees.length, 1);
    assert.isUndefined(getters.findById(emp2.id));
  });

  test('validation works correctly', () => {
    const employee = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '1111111111',
      department: 'IT',
      position: 'Developer'
    };
    
    actions.add(employee);
    
    const emailExists = getters.emailExists('test@example.com');
    assert.isTrue(emailExists);
    
    const phoneExists = getters.phoneExists('1111111111');
    assert.isTrue(phoneExists);
  });
});