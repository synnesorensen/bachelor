<template>
	<v-container>
		<v-app-bar app flat color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<v-tabs v-if="verifiedUser" v-model="tab" align-with-title>
				<v-tab>Oversikt</v-tab>
				<v-tab>Bestilling</v-tab>
				<v-tab>Profil</v-tab>
				<v-tab>Faktura</v-tab>
                <v-tab>Admin</v-tab>
			</v-tabs>
            <v-spacer />
            <v-btn 
                color="secondary" 
                @click="logout"
                >
                Logg ut
            </v-btn>
		</v-app-bar>
		<v-main>
			<v-tabs-items v-if="verifiedUser" v-model="tab">
				<v-tab-item><CustomerOverview /></v-tab-item>
				<v-tab-item><CustomerOrder /></v-tab-item>
				<v-tab-item><CustomerProfile /> <v-btn @click="getVendorFromApi">Press me </v-btn> </v-tab-item>
				<v-tab-item><CustomerInvoice /></v-tab-item>
                <v-tab-item><Admin /></v-tab-item>
			</v-tabs-items>
            <LoginDialog @loggedIn="loggedIn" />
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginDialog from './LoginDialog/LoginDialog.vue';
import CustomerOverview from './CustomerOverview.vue';
import CustomerOrder from './CustomerOrder.vue';
import CustomerProfile from './CustomerProfile.vue';
import CustomerInvoice from './CustomerInvoice.vue';
import getAuth from './LoginDialog/auth';
import {setApiBearerToken, getVendor, apiAxios} from '../api/api'
import Admin from './Admin/Admin.vue';

@Component({
	components: {
		LoginDialog,
		CustomerOverview,
		CustomerOrder,
		CustomerProfile,
		CustomerInvoice,
		CustomerNavBar,
        Admin
	},
})
export default class CustomerNavBar extends Vue {
	private tab = 0;
    private jwtToken = "";
    
    loggedIn(jwtToken: string) {
        this.jwtToken = jwtToken;
        setApiBearerToken(this.jwtToken);
    }

    get verifiedUser() {
        return (this.jwtToken != "")
    }

    logout() {
        // TODO: log out user
        const Auth = getAuth();
        Auth.signOut();
        this.jwtToken = "";
    }

    getVendorFromApi() {
        getVendor();
    }

}
</script>

