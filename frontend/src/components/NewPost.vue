<template>
    <div class="newPost">
        <form @submit.prevent="createOnePost()" >
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
            <!-- <button @click="uploadImage" type="submit"> Publier</button> -->
            <button type="submit"> Publier</button>
        </form>
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
