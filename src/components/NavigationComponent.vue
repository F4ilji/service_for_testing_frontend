<template>
  <nav class="px-0">
    <div class="wrapper">
      <button v-if="showBackButton" @click="$router.go(-1)" class="btn btn-primary">Назад</button>
      <router-link to="/">Главная</router-link>
      <router-link v-if="token" to="/profile">Профиль</router-link>
      <router-link v-if="token" to="/dashboard">Dashboard</router-link>
      <router-link v-if="!token" to="/login">Войти</router-link>
      <a v-if="token" @click.prevent="logout" href="#">Выйти</a>
    </div>
  </nav>
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'NavigationComponent',
  inject: ['$EventBus'],
  data() {
    return {
      token: null,
    }
  },
  methods: {
    getToken() {
      this.token = null
    },
    logout() {
      const token = localStorage.getItem('token')
      axios.post('http://127.0.0.1:8004/api/logout', null, {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/')
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => {
          this.token = null
        })
    },
  },

  updated() {
    this.token = localStorage.getItem('token')
  },
  computed: {
    showBackButton() {
      // Получаем текущий путь маршрутизатора
      const currentPath = this.$route.path;
      // Разбиваем путь на отдельные сегменты
      const segments = currentPath.split("/");
      // Проверяем длину массива сегментов
      return segments.length > 2;
    },
  }
};
</script>
  
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
  