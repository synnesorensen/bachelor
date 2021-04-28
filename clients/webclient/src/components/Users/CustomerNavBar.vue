<template>
	<v-container>
		<v-app-bar app flat color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<v-tabs v-model="tab" align-with-title>
				<v-tab>Oversikt</v-tab>
				<v-tab>Profil</v-tab>
				<v-tab>Faktura</v-tab>
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
            <CustomerOrder 
                :loggedInUser="loggedInUser" 
                v-if="userprofile==null" 
                @userprofile="newUserprofile" />
			<v-tabs-items v-else v-model="tab">
				<v-tab-item><CustomerOverview /></v-tab-item>
				<v-tab-item><CustomerProfile /> </v-tab-item>
				<v-tab-item><CustomerInvoice /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CustomerOverview from './CustomerOverview.vue';
import CustomerOrder from './CustomerOrder.vue';
import CustomerProfile from './CustomerProfile.vue';
import CustomerInvoice from './CustomerInvoice.vue';

@Component({
	components: {
		CustomerOverview,
		CustomerOrder,
		CustomerProfile,
		CustomerInvoice
	},
})
export default class CustomerNavBar extends Vue {
	private tab = 0;

    logout() {
        this.$emit("logout");
    }

    
  

}
</script>

