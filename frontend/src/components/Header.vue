<template>
    <header>
         <router-link to="/">
              <img
              src="../assets/groupomania-logo.png" 
              alt="Groupomania logo">
         </router-link>

         <nav>
            <router-link to='/account'>
                <a>Mon profil</a>
            </router-link>
            <a type="submit" @click = disconnect()> Se déconnecter </a>
        </nav>
    </header>
    
</template>

<script>

export default {
    name: 'Header',

    methods: {
        disconnect(){
            localStorage.removeItem('user');
            location.href = "/";
        }
}
}



</script> 

<style scoped>
 header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 70px 20px 70px;
        background-color: #F7D0D0;
    }
    header img {
        width: 250px;
        height: 100px;
        object-fit: cover;
    }
     a {
        padding: 10px;
        font-weight: 700;
        cursor: pointer;
    }

     @media (max-width: 700px) {
        header{
            flex-direction: column;
            padding: 30px 20px 20px 20px;
        }
    }
</style>