import {LitElement, html, css} from 'lit';
import {t, updateLanguage} from '../i18n.js';

class AppNav extends LitElement {
  constructor() {
    super();
    this.mobileMenuOpen = false;
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    this.requestUpdate();
  }


  static styles = css`
    nav {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-content {
      max-width: 1200px;
      display: flex;
      align-items: center;
    }
    .nav-left {
      flex: 1;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-left: auto;
      justify-content: end;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--base);
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover {
      color: var(--base);
    }
    .nav-links a.active {
      color: var(--base);
    }
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--base);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .mobile-menu-btn:hover {
      background-color: #f3f4f6;
    }
    
    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      nav {
        padding: 1rem;
      }
      .nav-content {
        position: relative;
      }
      .logo {
        font-size: 1.25rem;
      }
      .mobile-menu-btn {
        display: block;
      }
      .nav-links {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e5e7eb;
        border-top: none;
        flex-direction: column;
        gap: 0;
        padding: 1rem 0;
        margin-top: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform: translateY(-10px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease-out;
      }
      .nav-links.open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      .nav-links li {
        width: 100%;
      }
      .nav-links a {
        display: block;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #f3f4f6;
        font-size: 1rem;
        min-height: 48px;
        display: flex;
        align-items: center;
      }
      .nav-links a:hover {
        background-color: #f9fafb;
      }
      .nav-links li:last-child a {
        border-bottom: none;
      }
    }
    
    @media (max-width: 480px) {
      nav {
        padding: 0.75rem;
      }
      .logo {
        font-size: 1.125rem;
      }
      .nav-links {
        margin-top: 0.75rem;
      }
      .nav-links a {
        padding: 0.875rem 1rem;
        font-size: 0.9rem;
      }
    }
  `;
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.requestUpdate();
  }

  render() {
    const path = location.pathname;
    return html`
      <nav>
        <div class="nav-content">
          <div class="nav-left">
            <a href="/" class="logo">Orange Bank</a>
          </div>
          
          <div class="nav-right">
            <button class="mobile-menu-btn" @click=${this.toggleMobileMenu}>
              ${this.mobileMenuOpen ? '✕' : '☰'}
            </button>
            
            <ul class="nav-links ${this.mobileMenuOpen ? 'open' : ''}">
              <li><a href="/employees" class="${path === '/employees' ? 'active' : ''}" @click=${() => this.mobileMenuOpen = false}>${t('employees')}</a></li>
              <li><a href="/employees/new" class="${path === '/employees/new' ? 'active' : ''}" @click=${() => this.mobileMenuOpen = false}>+ ${t('add')}</a></li>
              <li>
                <span class="flag" title="TR/EN" @click=${this.#toggleLang} style="cursor: pointer; padding: 1rem 0;">
                  ${document.documentElement.lang?.startsWith('tr') ? '🇬🇧' : '🇹🇷'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  #toggleLang() {
    const isTr = document.documentElement.lang?.startsWith('tr');
    document.documentElement.lang = isTr ? 'en' : 'tr';
    this.requestUpdate();
    updateLanguage();
  }
}
customElements.define('app-nav', AppNav);
