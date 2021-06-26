<template>
	<v-container class="overflow-hidden"    >
		<v-app-bar 
            app 
            color="primary" 
            dark
            src="..\..\assets\smorblomst_crop.jpg"
        >
            <template v-slot:img="{ props }">
                <v-img
                    v-bind="props"
                    gradient="to top right, rgba(100,115,100,.8), rgba(25,32,25,0)"
                    required
                >
                </v-img>
            </template>
			<v-toolbar-title 
                class="font-weight-medium"
            >
                Lunsj på  hjul
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-slot:extension>
                <v-tabs v-model="tab" align-with-title >
                    <v-tab v-if="!userprofile.isVendor" @click="$refs.customerOverview.populateCalendar()">Kundekalender</v-tab>
                    <v-tab v-if="!userprofile.isVendor">Kundeprofil</v-tab>
                    <v-tab v-if="!userprofile.isVendor">Faktura</v-tab>
                    <v-tab v-if="userprofile.isVendor">AdminKalender</v-tab>
                    <v-tab v-if="userprofile.isVendor">Firmaprofil</v-tab>
                    <v-tab v-if="userprofile.isVendor">Betalinger</v-tab>
                    <v-tab v-if="userprofile.isVendor">Kundeliste</v-tab>
                </v-tabs>
            </template>
            <v-spacer />
            <v-btn 
                color="grey" 
                @click="logout">
                Logg ut
            </v-btn>
		</v-app-bar>
		<v-main>
            <v-container fluid>
                <v-tabs-items v-model="tab">
                    <v-tab-item v-if="!userprofile.isVendor"><CustomerOverview :userprofile="userprofile" :subscription="subscription" :loggedInUser="loggedInUser" ref="customerOverview" /></v-tab-item>
                    <v-tab-item v-if="!userprofile.isVendor"><CustomerProfile :userprofile="userprofile" :subscription="subscription" :loggedInUser="loggedInUser" /> </v-tab-item>
                    <v-tab-item v-if="!userprofile.isVendor"><CustomerInvoice :userprofile="userprofile" :subscription="subscription" /></v-tab-item>
                    <v-tab-item v-if="userprofile.isVendor"><AdminOverview :userprofile="userprofile" /></v-tab-item>
                    <v-tab-item v-if="userprofile.isVendor"><AdminProfile :userprofile="userprofile" /></v-tab-item>
                    <v-tab-item v-if="userprofile.isVendor"><AdminPayments /></v-tab-item>
                    <v-tab-item v-if="userprofile.isVendor"><AdminCustomers :loggedInUser="loggedInUser" /></v-tab-item>
                </v-tabs-items>
            </v-container>
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
import AdminCustomers from './Admin/AdminCustomers.vue';
import * as interfaces from './../../../../server/src/interfaces'
import { Prop } from 'vue-property-decorator';

@Component({
	components: {
		CustomerOverview,
		CustomerProfile,
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