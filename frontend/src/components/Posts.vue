<template>
 <div class="post">
     <article>
         <img src="post.User.image" alt="Image de profil">
         <span> Posté le {{post.createAt}}</span>
         <span> Par{{post.User.name}}</span>
     </article>
    </div>
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