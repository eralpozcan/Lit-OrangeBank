import {Router} from '@vaadin/router';
import './components/list.js';
import './components/employee-form.js';

export function initRouter(outlet) {
  const router = new Router(outlet);
  router.setRoutes([
    {path: '/', component: 'employee-list'},
    {path: '/employees', component: 'employee-list'},
    {path: '/employees/new', component: 'employee-form'},
    {
      path: '/employees/:id/edit',
      action: async (ctx, commands) => {
        const el = document.createElement('employee-form');
        el.employeeId = ctx.params.id;
        return el;
      },
    },
    {path: '(.*)', redirect: '/'},
  ]);
  return router;
}
