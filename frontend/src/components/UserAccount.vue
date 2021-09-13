<template>
<div class="UserAccount">
    <h1>Modifier votre profil {{user.name}}!</h1>
    <form>
             <div class="form-group">
                <label for="nom">Nom </label>
                <input type="name" class="form-control" v-model="name" id="name" placeholder="Entrez votre nom" maxlength="50" required>
            </div>
            <div>
                <label for="postContent">Biographie</label>
                <textarea name="biography" v-model="biography" id="biography" cols="30" rows="10" placeholder="Rentrez ici votre biographie"></textarea>
            </div>
            <div>
               <label for="image" class="pr-2">Image de profil</label>
               <input
                type="file"
                accept="image/png, image/jpeg,
                image/bmp, image/gif"
                ref="file"
                name="Charger une image"
              />
              </div>
            <button type="submit" @click = updateAccount($user.userId)> Modifier votre profil </button>
         </form>
    <button type="submit" @click = deleteAccount()> Supprimer le profil </button>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'UserAccount',
    data() {
        return {
            user:[],
            biography: "",
            name:"",
            file: ""
        };
    },

    methods: {
        uploadImage() {
            const file = this.$refs.file.files[0];
            this.file = file;
        },
        getAccount(){
            const userId = this.userId;
            axios.get(`http://localhost:3000/api/user/account/${userId}`,
            {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
            )
            .then(res => {
                this.user = res.data;
            })
        },
        deleteAccount(){
            const userId = this.userId;
            axios.delete(`http://localhost:3000/api/user/account/${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    }
                )
                .then(
                localStorage.removeItem('user'))
                .then(location.href = '/')

                .catch((error) => {
                    error
                });
            },

        updateAccount(userId){
            this.uploadImage();
            let DataForm = new FormData();
            DataForm.append('biography' , this.biography);
            DataForm.append('name' , this.name);
            DataForm.append('image' , this.file);

            axios.put(`http://localhost:3000/api/user/account/${userId}`, DataForm,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${this.$token}`
                    }
                }
            )
            
            .then(this.$root.$emit('Users'))
            .then(location.reload())
        },
    }
}
</script>
