<template>
  <div>
    <h2>Messages publiés</h2>
    <v-layout class="d-flex flex-column justify-center flex-nowrap" >
      <v-flex v-for="post in posts" :key="post.id" :id="'postId-'+post.id">
        <v-card class="pa-4 ma-6 mx-auto" max-width="500">

          <v-card-title>
            <v-avatar size="36px" class="mr-2">
              <v-img v-if="post.User.image" alt="Avatar" :src="post.User.image">
              </v-img>
              <v-icon dark v-else color="grey lighten-1">
                mdi-account-circle
              </v-icon>
            </v-avatar>
            <span class="post-userName body-1 text-lg-h6">Publié par {{post.User.name}}</span>
          </v-card-title>

          <v-card-text>
            <p>
              le {{post.createdAt | moment("D/M/YYYY")}}
            </p>
            <p>
              {{post.message}}
            </p>
          </v-card-text>

          <v-img v-if="post.image" :src="post.image" alt="image postée par l'utilisateur" :max-height="600"
            :max-width="400" class="mx-auto pb-5">
          </v-img>

          <div>
            <v-btn v-if="$user.userId == post.User.id || $user.userId ==1" type="submit" @click=deleteOnePost(post.id)
              color="red darken-1" text>
              Supprimer le message
            </v-btn>

            <v-btn v-if="$user.userId == post.User.id" type="submit" @click=modifyOnePost(post.id)
              color="orange lighten-1" text>
              Modifier le message
            </v-btn>
          </div>

          <div class="btnShowComment">
            <v-btn color="orange lighten-1" text :data-post-id="post.id" @click=showComment(post.id)>
              Commentaires
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon :data-post-id="post.id" @click=showComment(post.id)>
              <v-icon>{{'mdi-chevron-up'}}</v-icon>
            </v-btn>
          </div>

          <v-expand-transition>
            <div :data-post-id="post.id" class="comment" style="display:none">
              <v-divider></v-divider>
              <v-form>
                <v-textarea filled :name="'message-' + post.id" label="Commentaire" :id="'message-'+post.id"
                  placeholder="Ajouter un commentaire" color="orange orange-darken-4" auto-grow required></v-textarea>
                <div>
                  <v-btn @click.prevent=createOneComment(post.id) type="submit" color="orange lighten-1" text>
                    Publier un commentaire
                  </v-btn>
                </div>
              </v-form>
            </div>
          </v-expand-transition>
          <v-card-text class="commentMessage my-2" v-for="comment in post.Comments" :key="comment.id">
            <v-avatar size="36px">
              <v-img v-if="comment.User.image" alt="Avatar" :src="comment.User.image">
              </v-img>
              <v-icon dark v-else color="grey lighten-1">
                mdi-account-circle
              </v-icon>
            </v-avatar>
            <span class="post-userName">Publié par {{comment.User.name}}</span>
            <p>
              {{comment.message}}
            </p>
            <div>
              <v-btn v-if="$user.userId == comment.UserId || $user.userId ==1" type="submit"
                @click=deleteOneComment(comment.id) color="red darken-1" text class="pa-0">
                Supprimer le commentaire
              </v-btn>
            </div>
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
      }
    },

    mounted() {
      if (localStorage.user != undefined) {
        this.getAllPosts();
      }
    },

    methods: {

      showComment(commentPostId) {
        
          let postId = commentPostId
          let comment = document.querySelector("#postId-" + postId + " > div > div.comment")
          if (comment.style.display === "none") {
              comment.style.display = "block"
              let chevronUp = document.querySelector("#postId-" + postId + "> div > div.btnShowComment > button > span > i")
              chevronUp.classList = "v-icon notranslate mdi mdi-chevron-up theme--light"
          } else {
              comment.style.display = "none"
              let chevronDown = document.querySelector("#postId-" + postId + "> div > div.btnShowComment > button > span > i")
              chevronDown.classList = "v-icon notranslate mdi mdi-chevron-down theme--light"
          }
      },
      getAllPosts() {
        axios.get(`http://localhost:3000/api/post/`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          })
          .then(res => {
            this.posts = res.data;
          })
      },

      deleteOnePost(postId) {
        axios.delete(`http://localhost:3000/api/post/${postId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          })

        .then(location.reload())
        .catch((error) => {
          error
        });
      },

      modifyOnePost(postId) {
        localStorage.setItem('postId', postId)
        location.href = '/post';
      },

      createOneComment(postId) {
        let eltId = `message-${postId}`
        let goodMessage = document.getElementById(eltId).value

        console.log(eltId , goodMessage , postId);

        axios.post(`http://localhost:3000/api/post/${postId}/comments/`,

          {
            'message': goodMessage
          }, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          })
        .then(location.reload())

      },

      deleteOneComment(commentId) {
        axios.delete(`http://localhost:3000/api/post/comments/${commentId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$token}`
            }
          })
        .then(location.reload())
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
    .commentMessage {
      border: 2px double orange;
      border-radius: 20px!important;
      background-color: lightyellow;
    }

    .btnShowComment {
      display: flex;
    }
</style>