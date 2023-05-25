<template>
    <div>
      <div class="d-flex justify-content-between flex-wrap">
        <div class="card col-12 mb-3" style="margin-right: 15px;">
        <div class="card-body">
        <div class="d-flex">
          <h5 class="card-title" style="margin-right: 10px;">{{ test.title }}</h5>
          <p class="card-text">{{ difficulty }}</p>
        </div>
        <p>Кол-во вопросов: {{ test.questions }}</p>
        <button @click.prevent="startSession" v-if="hasToken && !session" class="btn btn-primary">Начать</button>
        <button @click.prevent="endSession" v-if="hasToken && session && isActualSession" class="btn btn-primary">Закончить</button>
        <h4 v-if="!hasToken">Авторизируйтесь для прохождения теста</h4>
      </div>
    </div>
    <div class="container" v-if="questions">
  <div class="row" v-for="quest in questions" :key="quest.id">
    <div class="col-md-12">
      <h5>{{ quest.quest }}</h5> <!-- здесь выводим текст вопроса -->
    </div>
    <div class="col-md-12">
      <label>
        <input checked @change.prevent="deleteAnswer(quest.id)" type="radio" :name="quest.id"> Не выбранно
      </label>
        <div class="form-group" v-for="ans in quest.answer" :key="ans.id">
          <label>
            <input @change.prevent="addAnswer(quest.id, ans.id)" type="radio" :name="quest.id" :value="ans.id" :checked="isChecked(quest.id, ans.id)"> {{ ans.body }}
          </label>
        </div>
    </div>
  </div>
</div>


  </div>
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        test: [],
        session: [],
        questions: [],
        answers: null,
        userAnswers: null,
        difficulty: null,
        hasToken: localStorage.getItem('token'),
        isActualSession: false,
        selectedAnswerId: null
      
      }
    },
    methods: {
      fetchTest() {
        axios.get('http://127.0.0.1:8004/api/tests/' + this.$route.params.id)
        .then(res => {
          this.test = res.data.data
          this.difficulty = res.data.data.difficulty.title
        })
      },
      startSession() {
        axios.post('http://127.0.0.1:8004/api/sessions/' + this.$route.params.id, null, {
          headers: {
          Authorization: 'Bearer ' + this.hasToken,
          }
        })
        .then(res => {
          this.session = res.data.data
          this.checkSession()
          console.log('session start')
        })
      },
      endSession() {
        try {
          this.setUserAnswer()
        } catch(e) {
          console.log(e)
        }
        axios.patch('http://127.0.0.1:8004/api/sessions/' + this.test.id, null, {
          headers: {
          Authorization: 'Bearer ' + this.hasToken,
          }
        })
        .then(res => {
          this.session = res.data.data
          this.questions = null
          this.answers = null
          localStorage.removeItem('answers')
          console.log('session end')
        })

      },
      checkSession() {
        axios.get('http://127.0.0.1:8004/api/session', {
          headers: {
          Authorization: 'Bearer ' + this.hasToken,
          }
        })
        .then(res => {
          this.session = res.data.data
          if(res.data.data.test.id === this.test.id) {
            this.isActualSession = true
            this.getQuestions()
          }
        })
        .catch(e => {
          if(e.response.status === 404) {
            this.session = null
          }
        })
      },
      getQuestions() {
        axios.get('http://127.0.0.1:8004/api/tests/' + this.test.id + '/questions', {
          headers: {
          Authorization: 'Bearer ' + this.hasToken,
          }
        })
        .then(res => {
          this.questions = res.data.data
          this.answers = res.data.data
        })
        .catch(e => {
          console.log(e)
        })
      },
      addAnswer(questId, answerId) {
        let answers = localStorage.getItem('answers')
        let NewAnswer = {
          'quest_id': questId,
          'answer_id': answerId
        }

        if (!answers) {
        localStorage.setItem('answers', JSON.stringify([NewAnswer]))
        console.log(questId, answerId)
      } else {
        answers = JSON.parse(answers)
        let existingAnswer = answers.find(answer => answer.quest_id === questId)
        if (existingAnswer) {
        existingAnswer.answer_id = answerId
      } else {
        answers.push(NewAnswer)
      }
      localStorage.setItem('answers', JSON.stringify(answers))
    }
      },
      deleteAnswer(questId) {
        let answers = localStorage.getItem('answers')

        
        if (answers) {
        answers = JSON.parse(answers)
        answers = answers.filter(answer => answer.quest_id !== questId)
        localStorage.setItem('answers', JSON.stringify(answers))
      }
      },
      isChecked(questId, ansId) {
      const answers = JSON.parse(localStorage.getItem('answers')) || [];
      const answer = answers.find(answer => answer.quest_id === questId && answer.answer_id === ansId);
      return answer !== undefined;
      },
      setUserAnswer() {

        const answers = JSON.parse(localStorage.getItem('answers'));

        const transformedAnswers = {
        questions: answers.map(answer => ({
          quest_id: answer.quest_id,
          answer_id: answer.answer_id
        }))
        };

        axios.post('http://127.0.0.1:8004/api/sessions/' + this.$route.params.id + '/answers', transformedAnswers, {
          headers: {
          Authorization: 'Bearer ' + this.hasToken,
          }
        })
        .then(res => {
          console.log(res)
        })
        .then(e => {
          console.log(e)
        })

      },
    },
    mounted() {
      this.fetchTest()
      this.checkSession()
    },



  }
  </script>
  