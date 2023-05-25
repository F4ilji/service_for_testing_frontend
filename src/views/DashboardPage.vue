<template>
  <p class="d-none">{{ changingTestId }}</p>
  <div>
    <div class="wrapper">
      <h1 class="mx-2">Dashboard</h1>
      <button v-if="!isCreating" @click.prevent="isCreating = true" class="btn btn-success">Добавить</button>
    </div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th class="text-center" scope="col">#</th>
          <th class="text-center" scope="col">Название</th>
          <th class="text-center" scope="col">Сложность</th>
          <th class="text-center" scope="col">Категория</th>
          <th class="text-center" scope="col">Кол-во вопросов</th>
          <th scope="col">Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isCreating">
          <th class="text-center">-</th>
          <td class="text-center"><input v-model="TestTitle" class="form-control" placeholder="Введите название"
              type="text"></td>
          <td class="text-center">
            <select v-model="Testdifficulty" class="form-select" aria-label="Default select example">
              <option selected value="1">Easy</option>
              <option value="2">Medium</option>
              <option value="3">Hard</option>
            </select>
          </td>
          <td class="text-center">
            <select v-model="TestCategory" class="form-select" aria-label="Default select example">
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.title }}</option>
            </select>
          </td>
          <td class="text-center">-</td>
          <td class="d-flex align-items-center">
            <button @click.prevent="createTest" class="btn btn-success">Создать</button>
            <button @click.prevent="isCreating = false" type="button" class="btn-close" aria-label="Close"></button>
          </td>
        </tr>
        <template v-for="test in tests" :key="test.id">
          <tr :class="(isEdit(test.id)) ? 'd-none' : ''">
            <th class="text-center">{{ test.id }}</th>
            <td class="text-center"><a @click.prevent="$router.push({ name: 'dashboardQuest', params: { id: test.id } })"
                href="#">{{ test.title }}</a></td>
            <td class="text-center">{{ test.difficulty.title }}</td>
            <td class="text-center">{{ test.category.title }}</td>
            <td class="text-center">{{ test.questions }}</td>
            <td>
              <button @click.prevent="isChangingTestId(test)" class="btn btn-primary mx-1">Изменить</button>
              <button @click.prevent="deleteTest(test.id)" class="btn btn-danger mx-1">Удалить</button>
            </td>
          </tr>
          <tr :class="(isEdit(test.id)) ? '' : 'd-none'">
            <th class="text-center">{{ test.id }}</th>
            <td class="text-center"><input v-model="TestTitle" class="form-control" placeholder="Введите название"
                type="text"></td>
            <td class="text-center">
              <select v-model="Testdifficulty" class="form-select">
                <option selected value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </td>
            <td class="text-center">
              <select v-model="TestCategory" class="form-select" aria-label="Default select example">
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.title }}
                </option>
              </select>
            </td>
            <td class="text-center">-</td>
            <td>
              <button @click.prevent="updateTest(test.id)" class="btn btn-success">Изменить</button>
            </td>
          </tr>

        </template>



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

export default {
  data() {
    return {
      changingTestId: null,
      tests: [],
      categories: [],
      isCreating: false,
      TestTitle: null,
      Testdifficulty: null,
      TestCategory: null,
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
    fetchCategories() {
      axios.get('http://127.0.0.1:8004/api/categories')
        .then(res => {
          this.categories = res.data.data
        })
    },
    createTest() {
      axios.post('http://127.0.0.1:8004/api/admin/tests',
        {
          title: this.TestTitle,
          difficulty_id: this.Testdifficulty,
          category_id: this.TestCategory,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }
        })
        .then(() => {
          this.isCreating = false
          this.TestTitle = null
          this.TestCategory = null
          this.Testdifficulty = null
          this.fetchTests()
        })
        .catch(e => {
          console.log(e)
        })
    },
    updateTest(id) {
      axios.put(`http://127.0.0.1:8004/api/admin/tests/${id}`,
        {
          title: this.TestTitle,
          difficulty_id: this.Testdifficulty,
          category_id: this.TestCategory,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }
        })
        .then(() => {
          this.changingTestId = null
          this.TestTitle = null
          this.TestCategory = null
          this.Testdifficulty = null
          this.fetchTests()
        })
        .catch(e => {
          console.log(e)
        })
    },
    deleteTest(id) {
      axios.delete(`http://127.0.0.1:8004/api/admin/tests/${id}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }
        })
        .then(() => {
          this.changingTestId = null
          this.TestTitle = null
          this.TestCategory = null
          this.Testdifficulty = null
          this.fetchTests()
        })
        .catch(e => {
          console.log(e)
        })
    },
    changePage(pageNumber) {
      this.page = pageNumber
      this.fetchTests()
    },
    isChangingTestId(test) {
      this.changingTestId = test.id
      this.TestTitle = test.title
      this.TestCategory = test.category.id
      this.Testdifficulty = test.difficulty.id
    },
    isEdit(id) {
      return this.changingTestId === id
    }
  },
  mounted() {
    this.fetchTests()
    this.fetchCategories()
  },



};
</script>
  
<style scoped>
.wrapper {
  display: flex;
  align-items: center;
}

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
  