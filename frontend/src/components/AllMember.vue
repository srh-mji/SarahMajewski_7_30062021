<template>
<div class="UserAccount">
    <h1>Tous nos membres:</h1>
<span></span>
    <v-layout wrap>
 <v-flex md4 v-for="user in users" :key="user.id">
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
                  <img v-if="user.image"
                    alt="Avatar"
                    src="user.image"
                  >
                  <v-icon dark v-else>
                     mdi-account-circle
                  </v-icon>
                </v-avatar>

         <span class="post-userName">{{user.name}}</span>
         <span class="post-info"> Création du compte le {{user.createdAt}}</span>
    </v-card-title>
    <v-card-text>
            <p>
              {{user.biography}}  
            </p>
    </v-card-text>
    <button v-if="$user.userId == 1" type="submit" @click = deleteAccount(user.id)> Supprimer le profil </button>
  </v-card>
  </v-flex>
  </v-layout>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AllMember',
    data() {
        return {
            users:[],
            biography: "",
            name:"",
            image: ""
        };
    },
     mounted() {
        if(localStorage.user != undefined){
            this.getAllUsers();
        }
    },

    methods: {
        getAllUsers(){
            axios.get(`http://localhost:3000/api/user/account/`,
            {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
            )
            .then(res => {
                this.users = res.data;
                console.log(this.users)
            })
        },

        deleteAccount(userId){
            axios.delete(`http://localhost:3000/api/user/account/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
                )
                .then(location.href = '/member',
                )

                .catch((error) => {
                    error
                })
            },
    }
}
</script>
