<template>
    <div>
        <div class="nav">
         <router-link to="/">
              <img id="groupomaniaLogo"
              src="../assets/groupomania-logo.png" 
              alt="Groupomania logo">
         </router-link>

         <router-link to="/">
              <img id="iconGroupomania"
              src="../assets/icon-groupomania.png" 
              alt="Groupomania logo">
         </router-link>

         <nav>
            <router-link to='/signup'>
                <div>S'inscrire</div>
            </router-link>
            <router-link to='/'>
            <div> Se connecter</div>
            </router-link>
        </nav>
        </div>
         <h1> Connexion</h1>
         <form action="" @submit.prevent="login">
             <div class="form-group">
                <label for="email">Adresse mail </label>
                <input type="email" class="form-control"  v-model="email" id="email" placeholder="Entrez votre adresse mail" maxlength="45" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe </label>
                <input type="password" class="form-control" v-model="password" id="password" placeholder="Entrez votre mot de passe" minlength="8" maxlength="25" required>
            </div>
            <div class="errorMessage">{{message}}</div>
            <button type="submit"> Envoyer </button>
         </form>
    </div>

    
</template>

<script>
import axios from 'axios';

export default {
    name: 'Login',

     data() {
        return {
            message: "",
            email: "",
            password: "",
        };
    },

    methods: {
        login(){
            axios.post(`http://localhost:3000/api/user/login`,
                {
                   'email' : this.email,
                    'password' : this.password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res.data));
                location.reload();
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    this.message = "Utilisateur inconnu.";
                }
                if (error.response.status === 401) {
                    this.message = "E-mail ou mot de passe invalide.";
                }
                if (error.response.status === 500) {
                    this.message = "Erreur serveur.";
                }
            });
        }}
}

</script> 

<style scoped>
#iconGroupomania {
        display:none;
    }
 .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 70px 20px 70px;
        background-color: #F7D0D0;
    }
    .nav img {
        width: 250px;
        height: 100px;
        object-fit: cover;
    }
    nav a {
        padding: 10px;
        font-weight: 700;
        color:black;
    }
    h1 {
        text-align: center;
        margin-top: 60px;
        background-color: #E4E5E7;
        padding:10px;
    }
    form{
        display: flex;
        flex-direction: column;
        align-content: center;
        max-width: 500px;
        margin: auto;
        margin-top: 60px;
    }
     form input{
        border-style: solid;
        font-size: 14px;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
    }
    .form-group {
        display: flex;
        flex-direction: column;
    }

    button {
        background-color: grey;
        opacity: 0.6;
         font-size: 16px;
        padding: 10px;
        margin-bottom: 15px;
        border-radius: 10px;
        text-align: center;
        color: white;
        font-weight: 700;
    }

     @media (max-width: 800px) {
        .nav{
            flex-direction: column;
            padding: 30px 20px 20px 20px;
        }
        nav {
         display: flex;
    }
          nav a {
        margin-right: 20px;
    }
        form {
            max-width: 300px;
        }
    
        #groupomaniaLogo {
            display: none;
        }

        #iconGroupomania {
        display:block;
        width:40px;
        height: 40px;
    }
    }
</style>