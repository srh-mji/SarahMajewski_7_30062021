<template> 
 <v-layout wrap>
 <v-flex md4 v-for="post in posts" :key="post.id">
  <v-card  
    class="mx-auto"
    color="#E4E4E4"
    dark
    max-width="400"
  >
    <v-card-title>
      <v-avatar
                  size="36px"
                >
                  <img v-if="post.User.image"
                    alt="Avatar"
                    src="post.User.image"
                  >
                  <v-icon dark v-else>
                     mdi-account-circle
                  </v-icon>
                </v-avatar>

         <span class="post-userName">Par {{post.User.name}}</span>
         <span class="post-info"> Posté le {{post.createdAt}}</span>
    </v-card-title>
    <v-card-text>
            <p>
              {{post.message}}
            </p>
    </v-card-text>
    <v-img
            alt="image postée par l'utilisateur"
            :max-height="600"
            :max-width="400"
            class="mx-auto pb-5"
          >
    </v-img>
  </v-card>
  </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Posts',
    data(){
        return {
            posts: [],
        }
    },
    mounted() {
        if(localStorage.user != undefined){
            this.getAllPosts();
        }
    },
    methods: {
        getAllPosts(){
            axios.get(`http://localhost:3000/api/post/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$token}`
                    }
                }
            )
            .then(res => {
                this.posts = res.data;
            })
        },
    }
}
</script>

<style scoped>

</style>