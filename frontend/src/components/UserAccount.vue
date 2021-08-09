<template>
<div class="UserAccount">
    <h1>Modifier votre profil !</h1>
    <a type="submit" @click = deleteAccount()> Supprimer le profil </a>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'UserAccount',

    methods: {
        deleteAccount(id){
            axios.delete(`http://localhost:3000/api/user/account/${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
                )
                .then(
                localStorage.removeItem('user'))
                // .then(
                // location.href = '/')

                .catch((error) => {
                    error
                });
            }
    }
}
</script>
