<template>
    <div id="account">
    <Login v-if="!connected" />

    <Header v-if="connected"/>
    <UserAccount v-if="connected"/>
  </div>
</template>

<script>
import Login from '@/components/Login.vue';
import Header from '@/components/Header.vue';
import UserAccount from '@/components/UserAccount.vue';

export default({
    name : 'Account',
    components : {
        Login,
        Header,
        UserAccount,
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