<template>
    <header>
         <router-link to="/">
              <img
              src="../assets/groupomania-logo.png" 
              alt="Groupomania logo">
         </router-link>

         <nav>
            <router-link to='/account'>
                <div>Mon profil</div>
            </router-link>
            <div> Se déconnecter</div>
        </nav>
    </header>
    
</template>

<script>

export default {
    name: 'Header'
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

     @media (max-width: 500px) {
        header{
            flex-direction: column;
            padding: 30px 20px 20px 20px;
        }
    }
</style>