<template>
    <div class="newPost">
        <h2>Publier un message</h2>
        <v-form @submit.prevent="createOnePost()"
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
                 Publier un message
                </v-btn>
            </v-card-actions>
        </v-form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'NewPost',
    data(){
        return {
            post: [],
             message: "",
             file: ""
        }
    },

    methods: {
        uploadImage() {
            const file = this.$refs.file.files[0];
            this.file = file;
        },
        createOnePost(){
            this.uploadImage();
            let DataForm = new FormData();
            DataForm.append('message' , this.message);
            DataForm.append('image' , this.file);

            axios.post(`http://localhost:3000/api/post/`, DataForm,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${this.$token}`
                    }
                }
            )
            
            .then(this.$root.$emit('Posts'))
            .then(location.href = '/')
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