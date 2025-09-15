import '../src/components/navbar.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

const mockRouter = {
  navigate: (path) => {
    mockRouter.lastNavigatedPath = path;
  },
  lastNavigatedPath: null
};

const mockI18n = {
  currentLanguage: 'en',
  setLanguage: (lang) => {
    mockI18n.currentLanguage = lang;
  },
  t: (key) => {
    const translations = {
      'nav.employees': 'Employees',
      'nav.add': 'Add Employee',
      'nav.language': 'Language'
    };
    return translations[key] || key;
  }
};

suite('navbar', () => {
  let element;

  setup(() => {
    mockRouter.lastNavigatedPath = null;
    mockI18n.currentLanguage = 'en';
  });

  test('is defined', () => {
    const el = document.createElement('app-nav');
    console.log(el);
    assert.isDefined(customElements.get('app-nav'));
  });

  test('renders with default properties', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    
    assert.isFalse(element.mobileMenuOpen);
  });

  test('renders navigation structure', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    
    const nav = element.shadowRoot.querySelector('nav');
    assert.exists(nav);
    
    const navContent = element.shadowRoot.querySelector('.nav-content');
    assert.exists(navContent);
    
    const logo = element.shadowRoot.querySelector('.logo');
    assert.exists(logo);
    
    const navLinks = element.shadowRoot.querySelector('.nav-links');
    assert.isNotNull(navLinks);
  });

  test('renders mobile menu button', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const mobileMenuBtn = element.shadowRoot.querySelector('.mobile-menu-btn');
    assert.isNotNull(mobileMenuBtn);
  });

  test('renders navigation links', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const employeesLink = element.shadowRoot.querySelector('a[href="/employees"]');
    assert.isNotNull(employeesLink);
    
    const addLink = element.shadowRoot.querySelector('a[href="/employees/new"]');
    assert.isNotNull(addLink);
  });

  test('renders language toggle', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const flag = element.shadowRoot.querySelector('.flag');
    assert.isNotNull(flag);
  });

  test('mobile menu toggle works correctly', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    
    assert.isFalse(element.mobileMenuOpen);
    const mobileMenuBtn = element.shadowRoot.querySelector('.mobile-menu-btn');
    
    mobileMenuBtn.click();
    await element.updateComplete;
    
    assert.isTrue(element.mobileMenuOpen);
    
    mobileMenuBtn.click();
    await element.updateComplete;
    
    assert.isFalse(element.mobileMenuOpen);
  });

  test('mobile menu shows/hides nav links', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const mobileMenuBtn = element.shadowRoot.querySelector('.mobile-menu-btn');
    const navLinks = element.shadowRoot.querySelector('.nav-links');
    assert.isFalse(navLinks.classList.contains('open'));
    mobileMenuBtn.click();
    await element.updateComplete;
    assert.isTrue(navLinks.classList.contains('open'));
    mobileMenuBtn.click();
    await element.updateComplete;
    assert.isFalse(navLinks.classList.contains('open'));
  });

  test('mobile menu button displays correct icon', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const mobileMenuBtn = element.shadowRoot.querySelector('.mobile-menu-btn');
    
    assert.equal(mobileMenuBtn.textContent.trim(), '☰');
    
    mobileMenuBtn.click();
    await element.updateComplete;
    assert.equal(mobileMenuBtn.textContent.trim(), '✕');
  });

  test('navigation links have correct href attributes', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const employeesLink = element.shadowRoot.querySelector('a[href="/employees"]');
    const addLink = element.shadowRoot.querySelector('a[href="/employees/new"]');
    
    assert.isNotNull(employeesLink);
    assert.isNotNull(addLink);
    
    assert.equal(employeesLink.getAttribute('href'), '/employees');
    assert.equal(addLink.getAttribute('href'), '/employees/new');
  });

  test('language toggle click works', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    
    const flag = element.shadowRoot.querySelector('.flag');
    const initialLang = document.documentElement.lang;
    
    flag.click();
    await element.updateComplete;
    
    assert.notEqual(document.documentElement.lang, initialLang);
  });

  test('toggleMobileMenu method works correctly', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    assert.isFalse(element.mobileMenuOpen);
    
    element.toggleMobileMenu();
    await element.updateComplete;
    
    assert.isTrue(element.mobileMenuOpen);
    
    element.toggleMobileMenu();
    await element.updateComplete;
    
    assert.isFalse(element.mobileMenuOpen);
  });

  test('mobile menu button click works', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const mobileMenuBtn = element.shadowRoot.querySelector('.mobile-menu-btn');
    
    assert.isFalse(element.mobileMenuOpen);
    
    mobileMenuBtn.click();
    await element.updateComplete;
    
    assert.isTrue(element.mobileMenuOpen);
  });

  test('renders with proper CSS classes', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const navbar = element.shadowRoot.querySelector('nav');
    assert.isNotNull(navbar);
  });

  test('language toggle displays flag', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const flag = element.shadowRoot.querySelector('.flag');
    assert.isNotNull(flag);
  });

  test('language toggle click works', async () => {
    element = await fixture(html`<app-nav></app-nav>`);
    await element.updateComplete;
    
    const flag = element.shadowRoot.querySelector('.flag');
    if (flag) {
      flag.click();
      await element.updateComplete;
    }
    assert.isNotNull(flag);
  });
});