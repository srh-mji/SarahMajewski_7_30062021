<template>
  <div>
    <h2>Messages publiés</h2>
    <v-layout wrap>
      <v-flex md4 v-for="post in posts" :key="post.id">
        <v-card class="mx-auto" max-width="500">

          <v-card-title>
            <v-avatar size="36px">
              <v-img v-if="post.User.image" alt="Avatar" :src="post.User.image">
              </v-img>
              <v-icon dark v-else color="grey lighten-1">
                mdi-account-circle
              </v-icon>
            </v-avatar>
            <span class="post-userName">Publié par {{post.User.name}}</span>
          </v-card-title>

          <v-card-text>
            <p>
              le {{post.createdAt | moment("calendar")}}
            </p>
            <p>
              {{post.message}}
            </p>
          </v-card-text>

          <v-img v-if="post.image" :src="post.image" alt="image postée par l'utilisateur" :max-height="600"
            :max-width="400" class="mx-auto pb-5">
          </v-img>

          <v-card-actions>
            <v-btn v-if="$user.userId == post.User.id || $user.userId ==1" type="submit" @click= deleteOnePost(post.id)
              color="red lighten-2" text>
              Supprimer le message
            </v-btn>

            <v-btn v-if="$user.userId == post.User.id" type="submit" @click= modifyOnePost(post.id)
              color="orange lighten-1" text>
              Modifier le message
            </v-btn>
          </v-card-actions>

          <v-card-actions>
            <v-btn @click="show = !show" color="orange lighten-1" text>
              Commentaires
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="show = !show"
            >
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>
              <v-form>
                <v-textarea filled name="message" v-model="message" label="Commentaire" :id="message + post.id"
                  placeholder="Ajouter un commentaire" color="orange orange-darken-4" auto-grow></v-textarea>
                <v-card-actions>
                  <v-btn @click= createOneComment(post.id) type="submit" color="orange lighten-1" text>
                    Publier un commentaire
                  </v-btn>
                </v-card-actions>
              </v-form>
            </div>
          </v-expand-transition>
          <v-card-text v-for="comment in post.Comments" :key="comment.id" 
          >
                <p>
                  {{comment.message}}
                </p>
                <v-card-action>
                <v-btn v-if="$user.userId == comment.UserId || $user.userId ==1" type="submit"
                @click= deleteOneComment(comment.id)
                  color="red lighten-2" text>
                  Supprimer le commentaire
                </v-btn>
              </v-card-action>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Posts',
    data() {
      return {
        posts: [],
        comments: [],
        message: "",
        file: "",
        show: false,
      }
    },

    mounted() {
      if (localStorage.user != undefined) {
        this.getAllPosts();
      }
    },

    methods: {
      getAllPosts() {
        axios.get(`http://localhost:3000/api/post/`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          })
          .then(res => {
            this.posts = res.data;
            console.log(this.posts)
          })
      },

      deleteOnePost(postId) {
        axios.delete(`http://localhost:3000/api/post/${postId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          })

          .then(location.href = '/')
          .catch((error) => {
            error
          });
      },

      modifyOnePost(postId) {
        localStorage.setItem('postId', postId)
        location.href = '/post';
      },

      createOneComment(postId) {
        let DataForm = new FormData();
        DataForm.append('message', this.message);

        axios.post(`http://localhost:3000/api/post/${postId}/comments/`, DataForm, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${this.$token}`
            }
          })

          .then(this.$root.$emit('Comments'))
          .then(location.href = '/')
      },

      deleteOneComment(commentId) {
        axios.delete(`http://localhost:3000/api/post/comments/${commentId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          })
          .then(location.href = '/')

          .catch((error) => {
            error
          });
      },
    }
  }
</script>

<style scoped>
    h2 {
        text-align: center;
        margin-top: 60px;
        background-color: #E4E5E7;
        padding:10px;
        margin-bottom: 30px;
        margin-top: 30px;
        font-size: 25px;
    }
</style>