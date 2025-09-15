import {v4 as uuidv4} from 'uuid';
import {actions, getters} from './base-store.js';

export function createEmployee(payload) {
  const id = uuidv4();
  const emp = {id, ...payload};
  actions.add(emp);
  return emp;
}
export function updateEmployee(id, payload) {
  actions.update({id, ...payload});
}
export function deleteEmployee(id) {
  actions.remove(id);
}
export {getters};
