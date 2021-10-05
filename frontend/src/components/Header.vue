<template>
    <header>
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
            <router-link to='/account'>
                <a>Mon profil</a>
            </router-link>
            <router-link to='/member'>
                <a>Membres</a>
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
        padding: 0px 70px 0px 70px;
        background-color: #F7D0D0;
        box-shadow: 5px 5px 10px #E4E4E4;
    }

    header img {
        width: 250px;
        height: 60px;
        object-fit: cover;
    }

    #iconGroupomania {
        display: none;
    }

    a {
        padding: 5px;
        font-weight: 700;
        color: black !important;
    }

    @media (max-width: 800px) {
        header {
            flex-direction: column;
            padding: 20px 0px 20px 0px;
        }

        #groupomaniaLogo {
            display: none;
        }

        #iconGroupomania {
            display: block;
            width: 40px;
            height: 40px;
        }
    }
</style>