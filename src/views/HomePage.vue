<template>
  <div>
    <div v-if="session" class="w-100">
      <div class="card flex-md-row mb-4 box-shadow h-md-250">
        <div class="card-body d-flex flex-column align-items-start">
          <strong class="d-inline-block mb-2 text-primary">Актуальная сессия</strong>
          <h3 class="mb-0">
            <a @click.prevent="$router.push({ name: 'testPage', params: { id: session.test.id } })" class="text-dark"
              href="#">{{ session.test.title }}</a>

          </h3>
          <div class="mb-1 text-muted">Осталось до коконца теста {{ remainingTime }} минут</div>
          <a @click.prevent="$router.push({ name: 'testPage', params: { id: session.test.id } })" href="#">Продолжить
            тест</a>
        </div>
      </div>
    </div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th class="text-center" scope="col">#</th>
          <th class="text-center" scope="col">Название</th>
          <th class="text-center" scope="col">Сложность</th>
          <th class="text-center" scope="col">Кол-во вопросов</th>
          <th scope="col">Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="test in tests" :key="test.id">
          <th class="text-center">{{ test.id }}</th>
          <td class="text-center">{{ test.title }}</td>
          <td class="text-center">{{ test.difficulty.title }}</td>
          <td class="text-center">{{ test.questions }}</td>
          <td><button v-if="test.questions > 0" @click.prevent="$router.push({ name: 'testPage', params: { id: test.id } })"
              class="btn btn-primary">Начать</button></td>
        </tr>

      </tbody>
    </table>
    <nav class="d-flex justify-content-center" aria-label="Page navigation example">
      <ul class="pagination">
        <li v-for="pageNumber in totalPages" :key="pageNumber" :class="{ 'active': page === pageNumber }"
          @click="changePage(pageNumber)" class="page-item">
          <a @click.prevent="" class="page-link" href="#">
            {{ pageNumber }}
          </a>
        </li>
      </ul>
    </nav>


  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
// @ is an alias to /src

export default {
  data() {
    return {
      tests: [],
      session: null,
      dateString: null,
      limit: 10,
      page: 1,
      totalPages: null,

    }
  },
  methods: {
    fetchTests() {
      axios.get('http://127.0.0.1:8004/api/tests', {
        params: {
          page: this.page
        }
      })
        .then(res => {
          this.tests = res.data.data
          console.log()
          this.totalPages = Math.ceil(res.data.meta.total / this.limit)

        })
    },
    checkSession() {
      axios.get('http://127.0.0.1:8004/api/session', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      })
        .then(res => {
          this.session = res.data.data
          this.dateString = res.data.data.end_test
          console.log(this.session)

        })
        .catch(e => {
          console.log(e)
        })
    },
    changePage(pageNumber) {
      this.page = pageNumber
      this.fetchTests()
    },
  },
  mounted() {
    this.fetchTests()
    if (localStorage.getItem('token')) {
      this.checkSession()
    }
  },
  computed: {
    remainingTime() {
      const targetDate = moment(this.dateString);
      const now = moment();
      const diffInMinutes = targetDate.diff(now, 'minutes');
      return diffInMinutes;
    },
  }
}
</script>
