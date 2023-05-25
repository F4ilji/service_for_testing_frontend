import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import './plugins/bootstrap';

const app = createApp(App);

app.config.globalProperties.$http = axios;

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401 || error.response.status === 419) {
      // Удаление токена из localStorage
      localStorage.removeItem('token');
      // Перенаправление на страницу login
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

app.use(router).mount('#app');


