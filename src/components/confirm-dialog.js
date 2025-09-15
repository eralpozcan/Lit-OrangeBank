import { LitElement, html, css } from 'lit';
import { icons } from './icons.js';
import { t } from '../i18n.js';

export class ConfirmDialog extends LitElement {
  static properties = { open: {type:Boolean}, message: {type:String}, isDelete: {type:Boolean} };
  static styles = css`
    :host { 
      position: fixed; 
      inset: 0; 
      display: none; 
      align-items: center; 
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      padding: 1rem;
      box-sizing: border-box;
    }
    :host([open]) { 
      display: flex; 
    }
    .box { 
      background: var(--card); 
      padding: 0;
      border-radius: var(--radius); 
      min-width: 400px; 
      max-width: 90vw;
      box-shadow: var(--shadow);
      border: var(--border);
      animation: slideIn 0.2s ease-out;
      overflow: hidden;
      max-height: 90vh;
    }
    @keyframes slideIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3);
      border-bottom: var(--border);
    }
    .title {
      color: var(--base);
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    .close-btn {
      background: none;
      border: none;
      color: var(--base);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover {
      background: var(--bg);
    }
    .content {
      padding: var(--space-3);
      overflow-y: auto;
    }
    .message {
      color: var(--text-base);
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }
    .actions { 
      display: flex; 
      flex-direction: column;
      gap: var(--space-2); 
      padding: var(--space-3);
      padding-top: 0;
    }
    .actions button {
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }
    .actions .primary {
      background: var(--base);
      color: white;
      order: 1;
    }
    .actions .primary:hover {
      background: #ea580c;
    }
    .actions .ghost {
      background: transparent;
      color: #6b7280;
      border: 1px solid #d1d5db;
      order: 2;
    }
    .actions .ghost:hover {
      background: var(--bg);
      border-color: #9ca3af;
    }
    
    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      :host {
        padding: 0.5rem;
        align-items: flex-end;
      }
      .box {
        min-width: unset;
        max-width: none;
        width: 100%;
        border-radius: 12px 12px 0 0;
        animation: slideUp 0.3s ease-out;
      }
      .title {
        font-size: 16px;
        text-align: center;
      }
      .message {
        text-align: center;
        font-size: 14px;
      }
      .actions {
        gap: var(--space-3);
      }
      .actions button {
        height: 48px;
        font-size: 16px;
      }
    }
    
    @media (max-width: 480px) {
      .header {
        padding: var(--space-2);
      }
      .content {
        padding: var(--space-2);
      }
      .actions {
        padding: var(--space-2);
        padding-top: 0;
      }
      .title {
        font-size: 14px;
      }
      .message {
        font-size: 13px;
      }
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  render() {
    return html`
      <div class="box">
        <div class="header">
          <h3 class="title">${this.isDelete ? t('confirmDelete') : t('confirmUpdate')}</h3>
          <button class="close-btn" @click=${() => this.#resolve(false)}>
            ${icons.close}
          </button>
        </div>
        <div class="content">
          <div class="message">${this.message}</div>
        </div>
        <div class="actions">
          <button class="primary" @click=${() => this.#resolve(true)}>
            ${this.isDelete ? t('del') : t('save')}
          </button>
          <button class="ghost" @click=${() => this.#resolve(false)}>
            ${t('cancel')}
          </button>
        </div>
      </div>
    `;
  }
  async confirm(message, isDelete = false) {
    this.message = message;
    this.isDelete = isDelete;
    this.setAttribute('open','');
    return new Promise(res => this._resolver = res);
  }
  #resolve(val){ this.removeAttribute('open'); this._resolver?.(val); }
}
customElements.define('confirm-dialog', ConfirmDialog);