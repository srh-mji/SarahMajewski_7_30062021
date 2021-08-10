<template>
    <div class="newPost">
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'NewPost',
    data(){
        return {
            posts: [],
        }
    },

    methods: {
        createOnePost(){
            axios.post(`http://localhost:3000/api/post/`,
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
