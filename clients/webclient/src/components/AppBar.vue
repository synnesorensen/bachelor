<template>
	<v-container>
		<v-app-bar app flat color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<v-tabs v-model="tab" align-with-title>
				<v-tab v-if="!userprofile.isVendor">Kundekalender</v-tab>
				<v-tab v-if="!userprofile.isVendor">Kundeprofil</v-tab>
				<v-tab v-if="!userprofile.isVendor">Faktura</v-tab>
                <v-tab v-if="userprofile.isVendor">AdminKalender</v-tab>
                <v-tab v-if="userprofile.isVendor">Firmaprofil</v-tab>
                <v-tab v-if="userprofile.isVendor">Betalinger</v-tab>
			</v-tabs>
            <v-spacer />
            <v-btn 
                color="secondary" 
                @click="logout">
                Logg ut
            </v-btn>
		</v-app-bar>
		<v-main>
			<v-tabs-items v-model="tab">
				<v-tab-item v-if="!userprofile.isVendor"><CustomerOverview /></v-tab-item>
				<v-tab-item v-if="!userprofile.isVendor"><CustomerProfile :userprofile="userprofile" :loggedInUser="loggedInUser" /> </v-tab-item>
				<v-tab-item v-if="!userprofile.isVendor"><CustomerInvoice /></v-tab-item>
                <v-tab-item v-if="userprofile.isVendor"><AdminOverview /></v-tab-item>
                <v-tab-item v-if="userprofile.isVendor"><AdminProfile /></v-tab-item>
                <v-tab-item v-if="userprofile.isVendor"><AdminPayments /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CustomerOverview from './Users/CustomerOverview.vue';
import CustomerProfile from './Users/CustomerProfile.vue';
import CustomerInvoice from './Users/CustomerInvoice.vue';
import AdminOverview from './Admin/AdminOverview.vue';
import AdminProfile from './Admin/AdminProfile.vue';
import AdminPayments from './Admin/AdminPayments.vue';
import * as interfaces from './../../../../server/src/interfaces'
import { Prop } from 'vue-property-decorator';

@Component({
	components: {
		CustomerOverview,
		CustomerProfile,
		CustomerInvoice,
        AdminOverview,
        AdminProfile, 
        AdminPayments
	},
})
export default class AppBar extends Vue {
    @Prop() userprofile!: interfaces.Userprofile;
    @Prop() loggedInUser!: string; 
	private tab = 0;

    logout() {
        this.$emit("logout");
    }

    newUserprofile() {
        this.$emit("newUserprofile", this.newUserprofile)
    }
  

}
</script>