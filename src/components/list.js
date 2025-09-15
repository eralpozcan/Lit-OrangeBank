import { LitElement, html, css, nothing } from 'lit';
import { subscribe } from '../store/base-store.js';
import { getters, deleteEmployee } from '../store/employee.js';
import { t, subscribe as i18nSubscribe } from '../i18n.js';
import './confirm-dialog.js';
import { icons } from './icons.js';

class EmployeeList extends LitElement {
  static properties = {
    view: { type: String },
    q: { type: String },
    page: { type: Number },
    perPage: { type: Number }
  };

  static styles = css`
    .card { padding: 0; }
    .row-hover tbody tr:hover { background:#fff; box-shadow: inset 0 0 0 9999px rgba(249,115,22,.05); }
    .head { display:flex; align-items:center; justify-content:space-between; padding: 1rem 1.2rem; }
    .head h3 { margin: 0; font-size: 1.25rem; color: var(--base); }
    .search-section { padding: 0 1.2rem 1rem; }
    .search-input { width: 100%; padding: 0.75rem 1rem; border: var(--border); border-radius: 10px; font-size: 0.875rem; background: #fff; }
    .search-input:focus { outline: none; border-color: var(--base); box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .icon-btn { width:36px; height:36px; display:grid; place-items:center; border-radius:10px; border: var(--border); background:#fff; cursor:pointer; color: var(--base); }
    .icon-btn:hover { background: var(--base-weak); }
    .icon-btn[active] { background: var(--base); color:#fff; border-color: var(--base); }
    .action-btn { display:flex; align-items:center; gap:0.5rem; padding:0.5rem 0.75rem; border-radius:10px; border: var(--border); background:#fff; cursor:pointer; font-size:0.875rem; font-weight:500; }
    .table-wrap { padding: 0 1.2rem 1.2rem; overflow-x: auto; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 800px; }
    th, td { padding:.9rem 1rem; border-bottom: var(--border); text-align:left; white-space: nowrap; }
    th { color: var(--base); font-weight:600; }
    .actions { display:flex; gap:.5rem; }
    .grid { display:grid; gap:1rem; grid-template-columns: repeat(3,1fr); }
    .item { padding:1.5rem; border:var(--border); border-radius: var(--radius); background:#fff; box-shadow: var(--shadow); }
    .item-header { margin-bottom: 1rem; }
    .item-name { font-size: 1.1rem; font-weight: 600; margin: 0 0 0.5rem 0; color: var(--text-base); }
    .item-content { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .item-column { display: flex; flex-direction: column; gap: 0.75rem; }
    .item-field { display: flex; flex-direction: column; }
    .item-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem; }
    .item-value { font-size: 0.9rem; color: var(--text-base); font-weight: 500; word-break: break-word; }
    .item-actions { display: flex; gap: 0.5rem; justify-content: flex-start; flex-wrap: wrap; }
    .badge { padding:.2rem .5rem; border-radius: 999px; border: var(--border); font-size:.85rem; color: var(--muted); display:inline-block; margin:.3rem 0 .6rem; }
    .pill { width: 28px; height: 28px; display:grid; place-items:center; border-radius: 999px; border: var(--border); background:#fff; }
    .pagination { display:flex; gap:.4rem; align-items:center; justify-content:center; padding: 1rem 0; flex-wrap: wrap; }
    .pagination .num { min-width:32px; height:32px; display:grid; place-items:center; border-radius:999px; border: var(--border); background:#fff; cursor:pointer; }
    .pagination .num[active] { background: var(--base); color:#fff; border-color: var(--base); }
    .pagination .pill[disabled] { opacity:.45; cursor:not-allowed; }
    
    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .head { padding: 0.75rem 1rem; flex-direction: column; gap: 1rem; align-items: stretch; }
      .head h3 { font-size: 1.1rem; text-align: center; }
      .search-section { padding: 0 1rem 1rem; }
      .table-wrap { padding: 0 1rem 1rem; }
      .grid { grid-template-columns: 1fr; gap: 0.75rem; }
      .item { padding: 1rem; }
      .item-content { grid-template-columns: 1fr; gap: 0.75rem; }
      .item-actions { justify-content: center; }
      .action-btn { flex: 1; justify-content: center; min-height: 44px; }
      .pagination { gap: 0.25rem; }
      .pagination .num { min-width: 28px; height: 28px; font-size: 0.875rem; }
      .pill { width: 24px; height: 24px; }
    }
    
    @media (max-width: 900px) {
      th:nth-child(4), td:nth-child(4),
      th:nth-child(5), td:nth-child(5),
      th:nth-child(8), td:nth-child(8) { display:none; }
    }
    
    @media (max-width: 600px) {
      th:nth-child(6), td:nth-child(6),
      th:nth-child(7), td:nth-child(7) { display:none; }
      th, td { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
      .icon-btn { width: 32px; height: 32px; }
    }
  `;

  constructor() {
    super();
    this.view = 'table';
    this.q = '';
    this.page = 1;
    this.perPage = 6;
    this._all = [];
    this._selected = new Set();
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = subscribe((st) => {
      this._all = st.employees ?? [];
      this.requestUpdate();
    });
    this.unsubscribeLanguage = i18nSubscribe(() => {
      this.requestUpdate();
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this.unsubscribeLanguage?.();
  }

  get _filtered() {
    const q = this.q.trim().toLowerCase();
    if (!q) return this._all;
    return this._all.filter(e => {
      const hay = `${e.firstName} ${e.lastName} ${e.email} ${e.department} ${e.position}`.toLowerCase();
      return hay.includes(q);
    });
  }
  get _paged() {
    const start = (this.page - 1) * this.perPage;
    return this._filtered.slice(start, start + this.perPage);
  }

  #gotoEdit(id) {
    history.pushState(null, '', `/employees/${id}/edit`);
    window.dispatchEvent(new Event('popstate'));
  }
  async #confirmDelete(id) {
    const employee = this._all.find(e => e.id === id);
    const message = employee ? `${employee.firstName} ${employee.lastName} ${t('confirmDeleteEmployee')}` : t('confirmDelete');
    const dlg = this.renderRoot.querySelector('confirm-dialog');
    if (await dlg.confirm(message, true)) deleteEmployee(id);
  }

  #toggleAll(e) {
    this._selected.clear();
    if (e.target.checked) this._paged.forEach(x => this._selected.add(x.id));
    this.requestUpdate();
  }
  #toggleRow(id, checked) {
    if (checked) {
      this._selected.add(id);
    } else {
      this._selected.delete(id);
    }
    this.requestUpdate();
  }

  #onSearchInput(e) {
    this.q = e.target.value;
    this.page = 1; // Reset to first page when searching
  }

  #pageList(total, current) {
    const out = [];
    const push = v => out.push(v);
    const range = (a,b)=>{ for(let i=a;i<=b;i++) push(i); };
    if (total <= 7) { range(1,total); return out; }
    push(1);
    if (current > 4) push('…');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    range(start, end);
    if (current < total - 3) push('…');
    push(total);
    return out;
  }

  render() {
    const totalPages = Math.max(1, Math.ceil(this._filtered.length / this.perPage));
    if (this.page > totalPages) this.page = totalPages;

    return html`
      <div class="container">
        <div class="card row-hover">
          <div class="head">
            <h3>${t('employeeList')}</h3>
            <div style="display:flex; gap:.4rem;">
              <button class="icon-btn" ?active=${this.view==='table'} @click=${()=>this.view='table'} title="${t('table')}">${icons.list}</button>
              <button class="icon-btn" ?active=${this.view==='list'}  @click=${()=>this.view='list'}  title="${t('list')}">${icons.grid}</button>
            </div>
          </div>

          <div class="search-section">
            <input 
              type="text" 
              class="search-input" 
              placeholder="${t('searchPlaceholder')}" 
              .value=${this.q || ''} 
              @input=${this.#onSearchInput}
            />
          </div>

          <div class="table-wrap">
            ${this.view === 'table' ? this.#table() : this.#cards()}
          </div>

          ${this._filtered.length === 0 ? html`<p style="padding:1rem 1.2rem;">${t('noResults')}</p>` : nothing}
          ${this.#pagination(totalPages)}
        </div>
      </div>
      <confirm-dialog></confirm-dialog>
    `;
  }

  #table() {
    return html`
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" @change=${this.#toggleAll}></th>
            <th>${t('firstName')}</th>
            <th>${t('lastName')}</th>
            <th>${t('doe')}</th>
            <th>${t('dob')}</th>
            <th>${t('phone')}</th>
            <th>${t('email')}</th>
            <th>${t('department')}</th>
            <th>${t('position')}</th>
            <th style="text-align:right;">${t('edit')} / ${t('del')}</th>
          </tr>
        </thead>
        <tbody>
          ${this._paged.map(e => html`
            <tr>
              <td><input type="checkbox" .checked=${this._selected.has(e.id)} @change=${ev=>this.#toggleRow(e.id, ev.target.checked)}></td>
              <td>${e.firstName}</td>
              <td>${e.lastName}</td>
              <td>${fmt(e.doe)}</td>
              <td>${fmt(e.dob)}</td>
              <td>${e.phone}</td>
              <td>${e.email}</td>
              <td>${e.department}</td>
              <td>${e.position}</td>
              <td>
                <div class="actions" style="justify-content:flex-end;">
                  <button class="icon-btn" @click=${()=>this.#gotoEdit(e.id)} title="${t('edit')}">${icons.edit}</button>
                  <button class="icon-btn" @click=${()=>this.#confirmDelete(e.id)} title="${t('del')}">${icons.trash}</button>
                </div>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  #cards() {
    return html`
      <div class="grid">
        ${this._paged.map(e => html`
          <div class="item">
            <div class="item-header">
              <h3 class="item-name">${e.firstName} ${e.lastName}</h3>
            </div>
            <div class="item-content">
              <div class="item-column">
                <div class="item-field">
                  <div class="item-label">${t('firstNameLabel')}</div>
                  <div class="item-value">${e.firstName}</div>
                </div>
                <div class="item-field">
                  <div class="item-label">${t('dateOfEmploymentLabel')}</div>
                  <div class="item-value">${fmt(e.doe)}</div>
                </div>
                <div class="item-field">
                  <div class="item-label">${t('phoneLabel')}</div>
                  <div class="item-value">${e.phone}</div>
                </div>
                <div class="item-field">
                  <div class="item-label">${t('departmentLabel')}</div>
                  <div class="item-value">${e.department}</div>
                </div>
              </div>
              <div class="item-column">
                <div class="item-field">
                  <div class="item-label">${t('lastNameLabel')}</div>
                  <div class="item-value">${e.lastName}</div>
                </div>
                <div class="item-field">
                  <div class="item-label">${t('dateOfBirthLabel')}</div>
                  <div class="item-value">${fmt(e.dob)}</div>
                </div>
                <div class="item-field">
                  <div class="item-label">${t('emailLabel')}</div>
                  <div class="item-value">${e.email}</div>
                </div>
                <div class="item-field">
                  <div class="item-label">${t('positionLabel')}</div>
                  <div class="item-value">${e.position}</div>
                </div>
              </div>
            </div>
            <div class="item-actions">
              <button class="action-btn" @click=${()=>this.#gotoEdit(e.id)} title="${t('edit')}" style="background: #6366f1; color: white; border-color: #6366f1;">${icons.edit} ${t('edit')}</button>
              <button class="action-btn" @click=${()=>this.#confirmDelete(e.id)} title="${t('del')}" style="background: #f97316; color: white; border-color: #f97316;">${icons.trash} ${t('del')}</button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  #pagination(total) {
    const pages = this.#pageList(total, this.page);
    return html`
      <div class="pagination">
        <button class="pill" ?disabled=${this.page===1} @click=${()=>this.page=Math.max(1,this.page-1)}>${icons.chevronLeft}</button>
        ${pages.map(p => p==='…'
          ? html`<span class="num" style="border:none;background:transparent;color:var(--muted)">…</span>`
          : html`<button class="num" ?active=${p===this.page} @click=${()=>this.page=p}>${p}</button>`
        )}
        <button class="pill" ?disabled=${this.page===total} @click=${()=>this.page=Math.min(total,this.page+1)}>${icons.chevronRight}</button>
      </div>
    `;
  }
}

function fmt(iso) { return iso ? iso.split('-').reverse().join('/') : ''; }

customElements.define('employee-list', EmployeeList);
export { EmployeeList };