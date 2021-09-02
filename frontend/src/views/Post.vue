<template>
  <div id="post">
    <Login v-if="!connected" />
    <Header v-if="connected"/>
    <EditPost v-if="connected"/>
  </div>
</template>

<script>
import EditPost from '@/components/EditPost.vue';
import Login from '@/components/Login.vue';
import Header from '@/components/Header.vue';

export default({
    name : 'Post',
    components : {
        Login,
        Header,
        EditPost
    },
    
    data() {
    return{
      connected: true
    };
  },

   created(){
    this.checkConnected()
    },
    
   methods: {
    checkConnected(){
      if(localStorage.user !== undefined){
        this.connected = true;
        console.log('Utilisateur connecté !');
      }
      else if(localStorage.user == undefined){
        this.connected = false;
        console.log('Utilisateur non connecté !');
      }
    }},
})

</script>