<template>
    <div>
        <div class="wrapper">
            <h1 class="mx-2">Вопрос {{ quest.quest }}</h1>
            <button v-if="!isCreating" @click.prevent="isCreating = true" class="btn btn-success">Добавить</button>
        </div>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th class="text-center" scope="col">#</th>
                    <th class="text-center" scope="col">Ответ</th>
                    <th class="text-center" scope="col">Правильный?</th>
                    <th scope="col">Действие</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isCreating">
                    <th class="text-center">-</th>
                    <td class="text-center"><input v-model="answerTitle" class="form-control" placeholder="Введите ответ"
                            type="text"></td>
                    <td class="text-center">
                        <select v-model="AnswerIsCorrect" name="" id="">
                            <option :value="true">Да</option>
                            <option :value="false">Нет</option>
                        </select>
                    </td>
                    <td class="d-flex align-items-center">
                        <button @click.prevent="createanswer" class="btn btn-success">Создать</button>
                        <button @click.prevent="isCreating = false" type="button" class="btn-close"
                            aria-label="Close"></button>
                    </td>
                </tr>
                <template v-for="answer in answers" :key="answer.id">
                    <tr :class="(isEdit(answer.id)) ? 'd-none' : ''">
                        <th class="text-center">{{ answer.id }}</th>
                        <td class="text-center">{{ answer.body }}</td>
                        <td class="text-center">{{ answer.is_correct ? 'Да' : 'Нет' }}</td>
                        <td>
                            <button @click.prevent="isChanginganswerId(answer)"
                                class="btn btn-primary mx-1">Изменить</button>
                            <button @click.prevent="deleteanswer(answer.id)" class="btn btn-danger mx-1">Удалить</button>
                        </td>
                    </tr>
                    <tr :class="(isEdit(answer.id)) ? '' : 'd-none'">
                        <th class="text-center">{{ answer.id }}</th>
                        <td class="text-center">
                            <input v-model="answerTitle" class="form-control" placeholder="Введите название" type="text">
                        </td>
                        <td class="text-center">
                            <select v-model="answerIsCorrect" name="" id="">
                                <option :value="true">Да</option>
                                <option :value="false">Нет</option>
                            </select>
                        </td>
                        <td>
                            <button @click.prevent="updateanswer(answer.id)" class="btn btn-success">Изменить</button>
                            <button @click.prevent="changinganswerId = null" type="button" class="btn-close"
                                aria-label="Close"></button>
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
            changinganswerId: null,
            quest: [],
            answers: [],
            isCreating: false,
            answerTitle: null,
            AnswerIsCorrect: null,
            limit: 10,
            page: 1,
            totalPages: null,
        }
    },
    methods: {
        fetchQuest() {
            axios.get(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.testId}/questions/${this.$route.params.questId}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(res => {
                    this.quest = res.data.data
                    this.answers = this.quest.answer
                })
        },
        fetchAnswers() {
            axios.get(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.testId}/questions/${this.$route.params.questId}/answers`,
                {
                    params: {
                        page: this.page
                    },
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(res => {
                    this.answers = res.data.data

                })
        },
        createanswer() {
            axios.post(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.testId}/questions/${this.$route.params.questId}/answers`,
                {
                    body: this.answerTitle,
                    is_correct: this.AnswerIsCorrect,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(() => {
                    this.isCreating = false
                    this.answerTitle = null
                    this.AnswerIsCorrect = null
                    this.fetchAnswers()
                })
                .catch(e => {
                    console.log(e)
                })
        },
        updateanswer(id) {
            axios.put(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.testId}/questions/${this.$route.params.questId}/answers/${id}`,
                {
                    body: this.answerTitle,
                    is_correct: this.AnswerIsCorrect,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(() => {
                    this.changinganswerId = null
                    this.answerTitle = null
                    this.AnswerIsCorrect = null
                    this.fetchAnswers()
                })
                .catch(e => {
                    console.log(e)
                })
        },
        deleteanswer(id) {
            axios.delete(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.testId}/questions/${this.$route.params.questId}/answers/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(() => {
                    this.changinganswerId = null
                    this.fetchAnswers()
                })
                .catch(e => {
                    console.log(e)
                })
        },
        changePage(pageNumber) {
            this.page = pageNumber
            this.fetchanswerions()
        },
        isChanginganswerId(answer) {
            this.changinganswerId = answer.id
            this.answerTitle = answer.body
            this.AnswerIsCorrect = answer.is_correct
        },
        isEdit(id) {
            return this.changinganswerId === id
        }
    },
    mounted() {
        this.fetchQuest()
        this.fetchAnswers()

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
    