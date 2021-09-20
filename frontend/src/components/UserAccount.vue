<template>
    <div class="UserAccount">
        <h2>Bienvenue sur votre profil {{user.name}} !</h2>
        <v-flex>
            <v-card class="mx-auto" max-width="400">
                <v-card-title>
                    <v-avatar size="36px">
                        <v-img v-if="user.image" alt="Avatar" :src="user.image">
                        </v-img>
                        <v-icon dark v-else color="grey lighten-1">
                            mdi-account-circle
                        </v-icon>
                    </v-avatar>
                    <span class="post-userName">{{user.name}}</span>
                </v-card-title>
                <v-card-text>
                    <p>
                        Création du compte le {{user.createdAt | moment("calendar")}}
                    </p>
                    <p>
                        {{user.biography}}
                    </p>
                </v-card-text>
            </v-card>
        </v-flex>

        <v-form>
            <v-text-field v-model="name" :counter="50" label="Nom" placeholder="Entrez votre nom" required
                color="orange orange-darken-4">
            </v-text-field>
            <v-textarea filled name="biography" v-model="biography" label="Biographie" :id="biography"
                placeholder="Parlez nous de vous" required color="orange orange-darken-4" :value="user.biography"
                auto-grow></v-textarea>
            <input type="file" accept="image/png, image/jpeg,
            image/bmp, image/gif" ref="file" name="Charger une image" />
            <v-card-actions>
                <v-btn type="submit" @click= updateAccount(user.id) color="orange lighten-1" text>
                    Modifier votre profil
                </v-btn>

                <v-btn type="submit" @click= deleteAccount(user.id) color="red lighten-2" text>
                    Supprimer le profil
                </v-btn>
            </v-card-actions>
        </v-form>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'UserAccount',
        data() {
            return {
                user: [],
                biography: "",
                name: "",
                file: ""
            };
        },
        mounted() {
            if (localStorage.user != undefined) {
                this.getAccount();
            }
        },

        methods: {
            uploadImage() {
                const file = this.$refs.file.files[0];
                this.file = file;
            },
            getAccount() {
                const userId = JSON.parse(localStorage.getItem('user')).userId;
                axios.get(`http://localhost:3000/api/user/account/${userId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    })
                    .then(res => {
                        this.user = res.data;
                        console.log(this.user)
                    })
            },
            deleteAccount(userId) {
                axios.delete(`http://localhost:3000/api/user/account/${userId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    })
                    .then(
                        localStorage.removeItem('user'))
                    .then(location.href = '/')

                    .catch((error) => {
                        error
                    });
            },

            updateAccount(userId) {
                this.uploadImage();
                let DataForm = new FormData();
                DataForm.append('biography', this.biography);
                DataForm.append('name', this.name);
                DataForm.append('image', this.file);

                axios.put(`http://localhost:3000/api/user/account/${userId}`, DataForm, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${this.$token}`
                        }
                    })

                    .then(this.$root.$emit('Users'))
                    .then(location.reload())
                    .catch((error) => {
                        error
                    });
            },
        }
    }
</script>
<style scoped>
    h2 {
        text-align: center;
        margin-top: 60px;
        background-color: #E4E5E7;
        padding: 10px;
        margin-bottom: 30px;
        margin-top: 30px;
        font-size: 25px;
    }
</style>