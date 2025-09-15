import {LitElement, html, css} from 'lit';
import './components/navbar.js';
import './components/list.js';
import './components/employee-form.js';
import {initRouter} from './router.js';

class AppRoot extends LitElement {
  static styles = css`
    main {
      padding-top: 0.8rem;
    }
  `;
  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet');
    console.log('App firstUpdated - outlet found:', outlet);
    if (!outlet) {
      console.error('Outlet element not found!');
      return;
    }
    try {
      initRouter(outlet);
      console.log('Router initialization completed');
    } catch (error) {
      console.error('Router initialization failed:', error);
    }
  }
  render() {
    return html`<app-nav></app-nav>
      <main id="outlet"></main>`;
  }
}
customElements.define('app-root', AppRoot);
