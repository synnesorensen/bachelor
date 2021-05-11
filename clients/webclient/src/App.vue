<template>
	<v-app>
        <AppBar 
            :loggedInUser="loggedInUser"
            :userprofile="userprofile"
            v-if="authorized && userprofile != null" 
            @logout="logout" 
            @newUserprofile="newUserprofile" />
        <LoginDialog v-if="!authorized" @loggedIn="loggedIn" :showDialog="!authorized" />
        <CustomerOrder 
                :loggedInUser="loggedInUser" 
                v-if="userprofile==null && authorized" 
                @newUserprofile="newUserprofile"
                @logout="logout" />
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AppBar from './components/AppBar.vue';
import LoginDialog from './components/LoginDialog/LoginDialog.vue';
import CustomerOrder from './components/Users/CustomerOrder.vue';
import getAuth from './components/LoginDialog/auth';
import api from '../src/api/api'
import * as interfaces from '../../../server/src/interfaces'
import { getUserInfo } from '../../../server/src/auth/getUserFromJwt'

@Component({
	components: {
        LoginDialog,
        AppBar,
        CustomerOrder
	},
})
export default class App extends Vue {
    private userprofile: interfaces.Userprofile | null = null;
    private jwtToken = "";
    private authorized = false;
    private loggedInUser: string | null = null;

    mounted() {
        const token = localStorage.getItem("token");
        console.log(token)
        if (token) {
            this.loggedIn(token);
        } else {
            this.authorized = false;
        }
    }
    
    async loggedIn(jwtToken: string) {
        this.jwtToken = jwtToken;
        localStorage.setItem("token", this.jwtToken);
        api.setApiBearerToken(this.jwtToken);
        this.userprofile = await api.getUserprofile();
        this.loggedInUser = getUserInfo(this.jwtToken);
        this.authorized = true;
    }

    logout() {
        const Auth = getAuth();
        Auth.signOut();
        this.jwtToken = "";
        this.authorized = false;
        localStorage.removeItem("token");
    }

    newUserprofile(userprofile: interfaces.Userprofile) {
        this.userprofile = userprofile;
    }


}
</script>
