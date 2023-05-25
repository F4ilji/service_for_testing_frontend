<template>
    <navigation-component></navigation-component>
    <router-view></router-view>  
  </template>
  
  <script>
  import NavigationComponent from './NavigationComponent.vue';
  export default {
    name: 'IndexComponent',
    components: {
      NavigationComponent,
    },
    data() {
      return {
      }
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
  
  <style>
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
  </style>
  