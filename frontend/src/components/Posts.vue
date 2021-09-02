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
            v-if="post.image"
            ref="post.image"
            alt="image postée par l'utilisateur"
            :max-height="600"
            :max-width="400"
            class="mx-auto pb-5"
          >
    </v-img>
    <button v-if="$user.userId == post.User.id" type="submit" @click = deleteOnePost(post.id)> Supprimer le message </button>
    <button v-if="$user.userId == post.User.id" type="submit" @click = modifyOnePost()> Modifier le message </button>
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
        deleteOnePost(postId){
            axios.delete(`http://localhost:3000/api/post/${postId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
                )
                .then(location.href = '/')

                .catch((error) => {
                    error
                });
            },
            modifyOnePost(){
                location.href = '/post'
            },
    }
}
</script>

<style scoped>

</style>