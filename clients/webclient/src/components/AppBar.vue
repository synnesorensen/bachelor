<template>
	<v-container>
		<v-app-bar app flat color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<v-tabs v-model="tab" align-with-title>
				<v-tab v-if="!userprofile.isAdmin">Kundekalender</v-tab>
				<v-tab v-if="!userprofile.isAdmin">Kundeprofil</v-tab>
				<v-tab v-if="!userprofile.isAdmin">Faktura</v-tab>
                <v-tab v-if="userprofile.isAdmin">AdminKalender</v-tab>
                <v-tab v-if="userprofile.isAdmin">Firmaprofil</v-tab>
				<v-tab v-if="userprofile.isAdmin">Fakturering</v-tab>
                <v-tab v-if="userprofile.isAdmin">Registrere betaling</v-tab>
			</v-tabs>
            <v-spacer />
            <v-btn 
                color="secondary" 
                @click="logout">
                Logg ut
            </v-btn>
		</v-app-bar>
		<v-main>
            <CustomerOrder 
                :loggedInUser="loggedInUser" 
                v-if="userprofile==null" 
                @newUserprofile="newUserprofile" />
			<v-tabs-items v-else v-model="tab">
				<v-tab-item><CustomerOverview /></v-tab-item>
				<v-tab-item><CustomerProfile /> </v-tab-item>
				<v-tab-item><CustomerInvoice /></v-tab-item>
                <v-tab-item><AdminOverview /></v-tab-item>
                <v-tab-item><AdminProfile /></v-tab-item>
				<v-tab-item><AdminInvoicing /></v-tab-item>
                <v-tab-item><AdminPayments /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CustomerOverview from './Users/CustomerOverview.vue';
import CustomerOrder from './Users/CustomerOrder.vue';
import CustomerProfile from './Users/CustomerProfile.vue';
import CustomerInvoice from './Users/CustomerInvoice.vue';
import AdminOverview from './Admin/AdminOverview.vue';
import AdminInvoicing from './Admin/AdminInvoicing.vue';
import AdminProfile from './Admin/AdminProfile.vue';
import AdminPayments from './Admin/AdminPayments.vue';
import * as interfaces from './../../../../server/src/interfaces'
import { Prop } from 'vue-property-decorator';

@Component({
	components: {
		CustomerOverview,
		CustomerOrder,
		CustomerProfile,
		CustomerInvoice,
        AdminOverview,
		AdminInvoicing,
        AdminProfile, 
        AdminPayments
	},
})
export default class AppBar extends Vue {
    @Prop() userprofile!: interfaces.Userprofile; 
	private tab = 0;

    logout() {
        this.$emit("logout");
    }

    newUserprofile() {
        this.$emit("newUserprofile", this.newUserprofile)
    }
  

}
</script>