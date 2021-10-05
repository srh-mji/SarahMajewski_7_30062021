<template>
  <div id="account">
    <Login v-if="!connected" />

    <Header v-if="connected"/>
    <AllMember v-if="connected"/>
  </div>
</template>

<script>
import Login from '@/components/Login.vue';
import Header from '@/components/Header.vue';
import AllMember from '@/components/AllMember.vue';

export default({
  name : 'Account',
  components : {
    Login,
    Header,
    AllMember,
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