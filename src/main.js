import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Gerenciamento global do cursor
router.beforeEach((to, from, next) => {
  // Ao sair de qualquer rota, garantir que o cursor normal esteja ativo
  document.body.classList.remove('selection-screen-body');
  next();
});

createApp(App).use(router).mount('#app')
