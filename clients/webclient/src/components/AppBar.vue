<template>
	<v-container>
		<v-app-bar app flat color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<v-tabs v-model="tab" align-with-title>
				<v-tab v-if="!userprofile.isVendor" @click="$refs.customerOverview.populateCalendar()">Kundekalender</v-tab>
				<v-tab v-if="!userprofile.isVendor">Kundeprofil</v-tab>
				<v-tab v-if="!userprofile.isVendor">Faktura</v-tab>
                <v-tab v-if="userprofile.isVendor">AdminKalender</v-tab>
                <v-tab v-if="userprofile.isVendor">Firmaprofil</v-tab>
                <v-tab v-if="userprofile.isVendor">Betalinger</v-tab>
                <v-tab v-if="userprofile.isVendor">Kundeliste</v-tab>
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
				<v-tab-item v-if="!userprofile.isVendor"><CustomerOverview :userprofile="userprofile" :subscription="subscription" ref="customerOverview" /></v-tab-item>
				<v-tab-item v-if="!userprofile.isVendor"><CustomerProfileTabs :userprofile="userprofile" :subscription="subscription" :loggedInUser="loggedInUser" /> </v-tab-item>
				<v-tab-item v-if="!userprofile.isVendor"><CustomerInvoice :userprofile="userprofile" :subscription="subscription" /></v-tab-item>
                <v-tab-item v-if="userprofile.isVendor"><AdminOverview :userprofile="userprofile" /></v-tab-item>
                <v-tab-item v-if="userprofile.isVendor"><AdminProfile :userprofile="userprofile" /></v-tab-item>
                <v-tab-item v-if="userprofile.isVendor"><AdminPayments /></v-tab-item>
                <v-tab-item v-if="userprofile.isVendor"><AdminCustomers :loggedInUser="loggedInUser" /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CustomerOverview from './Users/CustomerOverview.vue';
import CustomerProfileTabs from './Users/CustomerProfileTabs.vue';
import CustomerInvoice from './Users/CustomerInvoice.vue';
import AdminOverview from './Admin/AdminOverview.vue';
import AdminProfile from './Admin/AdminProfile.vue';
import AdminPayments from './Admin/AdminPayments.vue';
import AdminCustomers from './Admin/AdminCustomers.vue';
import * as interfaces from './../../../../server/src/interfaces'
import { Prop } from 'vue-property-decorator';

@Component({
	components: {
		CustomerOverview,
		CustomerProfileTabs,
		CustomerInvoice,
        AdminOverview,
        AdminProfile, 
        AdminPayments,
        AdminCustomers
	},
})
export default class AppBar extends Vue {
    @Prop() userprofile!: interfaces.Userprofile;
    @Prop() subscription!: interfaces.VendorSubscription;
    @Prop() loggedInUser!: string; 
	private tab = 0;

    logout() {
        this.$emit("logout");
    }
}
</script>