<template>
    <div class="editPost">
        <h2>Modifier votre message</h2>
        <v-layout>
            <v-flex>
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
                </v-card>
                <v-form @submit.prevent="modifyOnePost(post.id)"
                >
                        <v-textarea
                            filled
                            name="message"
                            v-model="message"
                            label="Message"
                            :id="message" 
                            placeholder="Quoi de neuf ?"
                            color="orange orange-darken-4"
                            auto-grow
                        ></v-textarea>

                        <input
                        type="file"
                        accept="image/png, image/jpeg,
                        image/bmp, image/gif"
                        ref="file"
                        name="Charger une image"
                        />


                        <v-card-actions>
                            <v-btn
                                type="submit" 
                                color="orange lighten-1"
                                text
                            >
                            Modifier le post
                            </v-btn>
                        </v-card-actions>
                </v-form>
            </v-flex>
        </v-layout>
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