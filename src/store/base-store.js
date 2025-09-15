import { generateSampleEmployees, defaultEmployees } from '../data/sample-employees.js';

const PERSISTENCE_KEY = 'employee-manager';
const localStorage = window.localStorage;

const listeners = new Set();

const init = (() => {
  const data = localStorage.getItem(PERSISTENCE_KEY);
  if (data) return JSON.parse(data);
  else {
    const sampleEmployees = generateSampleEmployees(50);
    return {
      employees: [...defaultEmployees, ...sampleEmployees],
    };
  }
})();

let state = init;

function persist() {
  localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  try {
    fn(state);
  } catch {}
  return () => {
    listeners.delete(fn);
  };
}

function emit() {
  persist();
  listeners.forEach((fn) => fn(state));
}

export const actions = {
  add(emp) {
    state.employees.push(emp);
    emit();
  },
  update(emp) {
    state.employees = state.employees.map((e) => {
      if (e.id === emp.id) return emp;
      else return e;
    });
    emit();
  },
  remove(id) {
    state.employees = state.employees.filter((emp) => emp.id !== id);
    emit();
  },
};

export const getters = {
  all: () => state.employees,
  findById: (id) => state.employees.find((emp) => emp.id === id),
  emailExists: (email, exceptId) =>
    getState().employees.some(
      (e) => e.email.toLowerCase() === email.toLowerCase() && e.id !== exceptId
    ),
  phoneExists: (phone, exceptId) =>
    getState().employees.some((e) => e.phone === phone && e.id !== exceptId),
};
