<template>
  <div>
    <h1 v-if="!sessions && !Actualsession">Нет пройденных тестов</h1>
    <div v-if="Actualsession" class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            :data-bs-target="'#flush' + Actualsession.id" aria-expanded="false" aria-controls="flush-collapseOne">
            <span style="margin-right: 10px;">{{ Actualsession.test.title }} #{{ Actualsession.id }}</span><span
              class="badge badge-light bg-primary">Актуальная сессия</span>
          </button>
        </h2>
        <div :id="'flush' + Actualsession.id" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
          data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Время начала</th>
                  <th scope="col">Время конца</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ new Date(Actualsession.created_at) }}</td>
                  <td>
                    <p>До конца теста {{ remainingTime(Actualsession.end_test) }} минут</p>
                    <button class="btn btn-primary"
                      @click.prevent="$router.push({ name: 'testPage', params: { id: Actualsession.test.id } })">Продолжить</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-if="sessions" class="accordion accordion-flush" id="accordionFlushExample">
      <div v-for="session in sessions" :key="session.id" class="accordion-item">
        <h2 class="accordion-header" id="flush-headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            :data-bs-target="'#flush' + session.id" aria-expanded="false" aria-controls="flush-collapseOne">
            <span style="margin-right: 10px;">{{ session.test.title }} #{{ session.id }}</span><span
              class="badge badge-light bg-primary" v-if="session.is_actual === true">Актуальная сессия</span>
          </button>
        </h2>
        <div :id="'flush' + session.id" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
          data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Баллы</th>
                  <th scope="col">Время начала</th>
                  <th scope="col">Время конца</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ session.score }}/{{ session.max_score }}</td>
                  <td>{{ new Date(session.created_at) }}</td>
                  <td v-if="session.is_actual === true">
                    <p>До конца теста {{ remainingTime(session.end_test) }} минут</p>
                    <button class="btn btn-primary"
                      @click.prevent="$router.push({ name: 'testPage', params: { id: session.test.id } })">Продолжить</button>
                  </td>
                  <td v-else>{{ new Date(session.end_test) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
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
export default {

  data() {
    return {
      sessions: null,
      Actualsession: null,
      limit: 10,
      page: 1,
      totalPages: null,
    }
  },
  methods: {
    checkSessions() {
      axios.get('http://127.0.0.1:8004/api/sessions', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        params: {
          page: this.page
        }
      })
        .then(res => {
          this.sessions = res.data.data
          this.totalPages = Math.ceil(res.data.meta.total / this.limit)
        })
        .catch(e => {
          if (e.response.status === 404) {
            this.sessions = null
          }
        })
    },
    remainingTime(end_test) {
      const targetDate = moment(end_test);
      const now = moment();
      const diffInMinutes = targetDate.diff(now, 'minutes');
      return diffInMinutes;
    },
    checkActualSession() {
      axios.get('http://127.0.0.1:8004/api/session', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      })
        .then(res => {
          this.Actualsession = res.data.data
        })
        .catch(e => {
          if (e.response.status === 404) {
            this.session = null
          }
        })
    },
    changePage(pageNumber) {
      this.page = pageNumber
      this.checkSessions()
    },
  },
  mounted() {
    this.checkSessions()
    this.checkActualSession()
  },



};
</script>
  
<style>
.page__wrapper {
  display: flex;
  justify-content: center;
}

.page__wrapper>div {
  padding: 10px;
  margin-right: 5px;
  border: 1px solid black;
}

.current__page {
  border: 2px solid red !important;
}
</style>
  