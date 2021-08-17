<template>
    <div class="newPost">
        <form @submit.prevent="createOnePost()" >
            <label for="postContent">Contenu</label>
            <textarea name="message" v-model="message" id="message" cols="30" rows="10" placeholder="Quoi de neuf ?"></textarea>
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
        }
    },

    methods: {
        createOnePost(){
            axios.post(`http://localhost:3000/api/post/`,
                {
                        'message':this.message,
                    },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$token}`
                    }
                }
            )
            
            .then(this.$root.$emit('Posts'));
        },
    }
}
</script>
