import { LitElement, html, css } from 'lit';
import { getters, createEmployee, updateEmployee } from '../store/employee.js';
import { t, subscribe } from '../i18n.js';
import './confirm-dialog.js';
import { icons } from './icons.js';

const DEPTS = ["Analytics","Tech"];
const POS = ["Junior","Medior","Senior"];

export class EmployeeForm extends LitElement {
  static properties = { employeeId: {type:String} };
  static styles = css`
    .container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
    .form-title { font-size: 1.5rem; font-weight: 600; color: var(--base); margin-bottom: 2rem; }
    .edit-info { font-size: 0.9rem; color: var(--text); margin-bottom: 1.5rem; }
    form { display: grid; gap: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    label { display: flex; flex-direction: column; gap: 0.5rem; }
    label span { font-weight: 500; color: var(--text); font-size: 0.9rem; }
    input, select { 
      padding: 0.75rem; 
      border: 1px solid #ddd; 
      border-radius: 4px; 
      font-size: 1rem;
      transition: border-color 0.2s;
      min-height: 44px;
      box-sizing: border-box;
    }
    input:focus, select:focus { 
      outline: none; 
      border-color: var(--base); 
    }
    .actions { 
      display: flex; 
      gap: 1rem; 
      justify-content: center; 
      margin-top: 1rem;
    }
    .actions button {
      padding: 0.75rem 2rem;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      min-height: 44px;
      border: none;
    }
    .actions .ghost {
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
    }
    .actions .ghost:hover {
      background: var(--bg-hover);
    }
    .actions .primary {
      background: var(--base);
      border: 1px solid var(--base);
      color: white;
    }
    .actions .primary:hover {
      background: var(--base-hover);
      border-color: var(--base-hover);
    }
    .err { color: var(--error); font-size: 0.9rem; margin-top: 0.5rem; }
    
    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .container { padding: 1rem; }
      .form-title { font-size: 1.25rem; margin-bottom: 1.5rem; text-align: center; }
      .edit-info { text-align: center; font-size: 0.875rem; }
      .form-grid { grid-template-columns: 1fr; gap: 1rem; }
      input, select { 
        padding: 1rem; 
        font-size: 16px; /* Prevents zoom on iOS */
        min-height: 48px;
      }
      label span { font-size: 1rem; }
      .actions { 
        flex-direction: column; 
        gap: 0.75rem; 
        margin-top: 1.5rem;
      }
      .actions button {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        min-height: 48px;
      }
      .err { font-size: 1rem; text-align: center; }
    }
    
    @media (max-width: 1200px) and (min-width: 769px) { 
      .form-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
    }
    
    @media (max-width: 480px) {
      .container { padding: 0.75rem; }
      form { gap: 1rem; }
      .form-grid { gap: 0.75rem; }
    }
  `;
  constructor(){ 
    super(); 
    this.employeeId = undefined; 
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeLanguage = subscribe(() => {
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeLanguage?.();
  }
  get editing(){ return !!this.employeeId; }
  get model(){
    if (!this.editing) return {};
    const e = getters.findById(this.employeeId);
    return e ?? {};
  }

  render() {
    const m = this.model;
    return html`
      <div class="container">
        <h1 class="form-title">${this.editing ? t('editEmployee') : t('addEmployee')}</h1>
        ${this.editing ? html`<div class="edit-info">You are editing ${m.firstName} ${m.lastName}</div>` : ''}
        
        <form @submit=${this.#onSubmit}>
          <div class="form-grid">
            ${this.#input('firstName', t('firstName'), m.firstName)}
            ${this.#input('lastName', t('lastName'), m.lastName)}
            ${this.#input('doe', t('dateOfEmployment'), m.doe, 'date')}
            ${this.#input('dob', t('dateOfBirth'), m.dob, 'date')}
            ${this.#input('phone', t('phone'), m.phone, 'tel')}
            ${this.#input('email', t('email'), m.email, 'email')}
            ${this.#select('department', t('department'), DEPTS, m.department)}
            ${this.#select('position', t('position'), POS, m.position)}
          </div>
          
          <div id="errors" class="err"></div>
          
          <div class="actions">
            <button class="primary" type="submit">${t('save')}</button>
            <button type="button" class="ghost" @click=${this.#back}>${t('cancel')}</button>
          </div>
        </form>
      </div>
      <confirm-dialog></confirm-dialog>
    `;
  }

  #input(name, label, value='', type='text'){
    return html`<label>
      <span>${label}</span>
      <input name=${name} .value=${value ?? ''} type=${type} required />
    </label>`;
  }
  #select(name, label, options, value=''){
    return html`<label>
      <span>${label}</span>
      <select name=${name} .value=${value ?? ''} required>
        <option value="" disabled selected>${t('pleaseSelect')}</option>
        ${options.map(o=>html`<option value=${o} ?selected=${value === o}>${t(o.toLowerCase())}</option>`)}
      </select>
    </label>`;
  }

  async #onSubmit(e){
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const errs = validate(data, this.employeeId);
    const errEl = this.renderRoot.getElementById('errors');
    errEl.textContent = errs.join(' ');
    if (errs.length) return;

    const dlg = this.renderRoot.querySelector('confirm-dialog');
    const ok = await dlg.confirm(this.editing ? t('confirmUpdate') : t('save'));
    if (!ok) return;

    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      dob: data.dob, doe: data.doe,
      phone: data.phone.trim(),
      email: data.email.trim(),
      department: data.department, position: data.position
    };
    if (this.editing) updateEmployee(this.employeeId, payload);
    else createEmployee(payload);

    this.#back();
  }
  #back(){ history.pushState(null,'','/employees'); window.dispatchEvent(new Event('popstate')); }
}
customElements.define('employee-form', EmployeeForm);

import { getters as S } from '../store/employee.js';
function validate(d, exceptId){
  const errs = [];
  
  // Basit email kontrolü
  const emailOk = d.email.includes('@') && d.email.includes('.');
  if (!emailOk) errs.push(t('invalidEmail'));
  if (S.emailExists(d.email, exceptId)) errs.push(t('uniqueEmail'));
  
  // Basit telefon kontrolü - sadece rakam sayısı
  const phoneDigits = d.phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) errs.push(t('invalidPhone'));
  if (S.phoneExists(d.phone, exceptId)) errs.push(t('uniquePhone'));

  const dob = new Date(d.dob), doe = new Date(d.doe);
  const age = (new Date().getTime() - dob.getTime()) / (365.25*24*3600*1000);
  if (!(age >= 18)) errs.push(t('ageError'));
  if (!(doe > dob)) errs.push(t('dateOrder'));

  return errs;
}