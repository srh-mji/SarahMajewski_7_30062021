<template>
    <div class="editPost">
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
  </v-card>

        <form @submit.prevent="modifyOnePost(post.id)" >
            <label for="postContent">Contenu</label>
            <textarea name="message" v-model="message" id="message" cols="30" rows="10" placeholder="Quoi de neuf ?"></textarea>
            <div>
               <label for="image" class="pr-2">Image</label>
               <input
                type="file"
                accept="image/png, image/jpeg,
                image/bmp, image/gif"
                ref="file"
                name="Charger une image"
              />
              </div>
            <button type="submit"> Modifier le post</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'EditPost',
    data(){
        return {
             post: [],
             message: "",
             file: "",
        }
    },
    mounted() {
        if(localStorage.user != undefined){
            this.getOnePost();
        }
    },
    methods: {
        uploadImage() {
            const file = this.$refs.file.files[0];
            this.file = file;
        },
        getOnePost(){
            let postId= localStorage.getItem('postId');
            axios.get(`http://localhost:3000/api/post/${postId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$token}`
                    }
                }
            )
            .then(res => {
                this.post = res.data;
            })
        },
        modifyOnePost(postId){
            this.uploadImage();
            let DataForm = new FormData();
            DataForm.append('message' , this.message);
            DataForm.append('image' , this.file);

            axios.put(`http://localhost:3000/api/post/${postId}`, DataForm,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
                )
                .then(this.$root.$emit('Posts'))
                .then(location.href = '/')
                .then(localStorage.removeItem('postId'))
                .catch((error) => {
                    error
                });
            },

    }
}
</script>