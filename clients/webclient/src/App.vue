<template>
	<v-app>
        <customer-nav-bar></customer-nav-bar>
		<!-- <v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title>Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<v-spacer></v-spacer>
		</v-app-bar> -->
		<v-main>
			<v-tabs v-model="tab" align-with-title>
				<v-tab>Login</v-tab>
				<v-tab>Kundeoversikt</v-tab>
				<v-tab>Bestilling</v-tab>
				<v-tab>Profil</v-tab>
				<v-tab>Faktura</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tab">
				<v-tab-item><LoginDialog /></v-tab-item>
				<v-tab-item><CustomerOverview /></v-tab-item>
				<v-tab-item><CustomerOrder /></v-tab-item>
				<v-tab-item><CustomerProfile /></v-tab-item>
				<v-tab-item><CustomerInvoice /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginDialog from './components/LoginDialog/LoginDialog.vue';
import CustomerOverview from './components/CustomerOverview.vue';
import CustomerOrder from './components/CustomerOrder.vue';
import CustomerProfile from './components/CustomerProfile.vue';
import CustomerInvoice from './components/CustomerInvoice.vue';
import CustomerNavBar from './components/CustomerNavBar.vue';

@Component({
	components: {
		LoginDialog,
		CustomerOverview,
		CustomerOrder,
		CustomerProfile,
		CustomerInvoice,
		CustomerNavBar,
	},
})
export default class App extends Vue {
	private tab = 0;
}
</script>
