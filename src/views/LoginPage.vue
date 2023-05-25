<template>
    <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
  </div>

  <button @click.prevent="login" type="submit" class="btn btn-primary">Submit</button>
</form>

</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginPage',
    data() {
        return {
            email: null,
            password: null,
            token: null,
        }
    },

    methods: {
        login() {
            axios.post('http://127.0.0.1:8004/api/login', {email: this.email, password: this.password})
            .then(data => {
                this.token = data.data.token
                localStorage.setItem('token', this.token)
                this.$router.push({ name: 'home' });

            })
            .catch(e => {
                console.log(e)
            })
        }

    },

}
</script>
