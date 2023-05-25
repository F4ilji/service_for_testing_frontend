<template>
    <p class="d-none">{{ changingQuestId }}</p>
    <div>
        <div class="wrapper">
            <h1 class="mx-2">Тест {{ test.title }}</h1>
            <button v-if="!isCreating" @click.prevent="isCreating = true" class="btn btn-success">Добавить</button>
        </div>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th class="text-center" scope="col">#</th>
                    <th class="text-center" scope="col">Вопрос</th>
                    <th class="text-center" scope="col">Балл</th>
                    <th scope="col">Действие</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isCreating">
                    <th class="text-center">-</th>
                    <td class="text-center"><input v-model="QuestTitle" class="form-control" placeholder="Введите название"
                            type="text"></td>
                    <td class="text-center"><input v-model="QuestScore" class="form-control"
                            placeholder="Введите кол-во баллов" type="integer"></td>
                    <td class="d-flex align-items-center">
                        <button @click.prevent="createQuest" class="btn btn-success">Создать</button>
                        <button @click.prevent="isCreating = false" type="button" class="btn-close"
                            aria-label="Close"></button>
                    </td>
                </tr>
                <template v-for="Quest in quests" :key="Quest.id">
                    <tr :class="(isEdit(Quest.id)) ? 'd-none' : ''">
                        <th class="text-center">{{ Quest.id }}</th>
                        <td class="text-center"><a @click.prevent="$router.push({ name: 'dashboardAnswer', params: { testId: test.id, questId: Quest.id } })" href="#">{{ Quest.quest }}</a></td>
                        <td class="text-center">{{ Quest.score }}</td>
                        <td>
                            <button @click.prevent="isChangingQuestId(Quest)" class="btn btn-primary mx-1">Изменить</button>
                            <button @click.prevent="deleteQuest(Quest.id)" class="btn btn-danger mx-1">Удалить</button>
                        </td>
                    </tr>
                    <tr :class="(isEdit(Quest.id)) ? '' : 'd-none'">
                        <th class="text-center">{{ Quest.id }}</th>
                        <td class="text-center"><input v-model="QuestTitle" class="form-control"
                                placeholder="Введите название" type="text"></td>
                        <td class="text-center"><input v-model="QuestScore" type="number"></td>
                        <td>
                            <button @click.prevent="updateQuest(Quest.id)" class="btn btn-success">Изменить</button>
                            <button @click.prevent="changingQuestId = null" type="button" class="btn-close"
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
            changingQuestId: null,
            test: [],
            quests: [],
            isCreating: false,
            QuestTitle: null,
            QuestScore: null,
            limit: 10,
            page: 1,
            totalPages: null,
        }
    },
    methods: {
        fetchTest() {
            axios.get(`http://127.0.0.1:8004/api/tests/${this.$route.params.id}`)
                .then(res => {
                    this.test = res.data.data
                })
        },
        fetchQuestions() {
            axios.get(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.id}/questions`,
                {
                    params: {
                        page: this.page
                    },
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(res => {
                    this.quests = res.data.data
                    this.totalPages = Math.ceil(res.data.meta.total / this.limit)

                })
        },
        createQuest() {
            axios.post(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.id}/questions`,
                {
                    quest: this.QuestTitle,
                    score: this.QuestScore,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(() => {
                    this.isCreating = false
                    this.QuestTitle = null
                    this.QuestScore = null
                    this.fetchQuestions()
                })
                .catch(e => {
                    console.log(e)
                })
        },
        updateQuest(id) {
            axios.put(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.id}/questions/${id}`,
                {
                    quest: this.QuestTitle,
                    score: this.QuestScore,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(() => {
                    this.changingQuestId = null
                    this.QuestTitle = null
                    this.QuestScore = null
                    this.fetchQuestions()
                })
                .catch(e => {
                    console.log(e)
                })
        },
        deleteQuest(id) {
            axios.delete(`http://127.0.0.1:8004/api/admin/tests/${this.$route.params.id}/questions/${id}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(() => {
                    this.changingQuestId = null
                    this.fetchQuestions()
                })
                .catch(e => {
                    console.log(e)
                })
        },
        changePage(pageNumber) {
            this.page = pageNumber
            this.fetchQuestions()
        },
        isChangingQuestId(Quest) {
            this.changingQuestId = Quest.id
            this.QuestTitle = Quest.quest
            this.QuestScore = Quest.score
        },
        isEdit(id) {
            return this.changingQuestId === id
        }
    },
    mounted() {
        this.fetchTest()
        this.fetchQuestions()
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
    