<template>
	<v-header>
		<v-app-bar app flat color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
            <!-- TODO: Change these to use router at some point -->
			<v-tabs v-model="tab" align-with-title>
				<v-tab>Login</v-tab>
				<v-tab>Kundeoversikt</v-tab>
				<v-tab>Bestilling</v-tab>
				<v-tab>Profil</v-tab>
				<v-tab>Faktura</v-tab>
                <v-tab>Admin</v-tab>
			</v-tabs>
		</v-app-bar>
		<v-main>
			<v-tabs-items v-model="tab">
				<v-tab-item><LoginDialog /></v-tab-item>
				<v-tab-item><CustomerOverview /></v-tab-item>
				<v-tab-item><CustomerOrder /></v-tab-item>
				<v-tab-item><CustomerProfile /></v-tab-item>
				<v-tab-item><CustomerInvoice /></v-tab-item>
                <v-tab-item><Admin /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginDialog from './LoginDialog/LoginDialog.vue';
import CustomerOverview from './CustomerOverview.vue';
import CustomerOrder from './CustomerOrder.vue';
import CustomerProfile from './CustomerProfile.vue';
import CustomerInvoice from './CustomerInvoice.vue';
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
}
</script>

<style scoped>
.appbar {
	width: 100%;
}

.titleName {
	width: 100%;
}

.navbar {
	width: 100%;
}

.navbtn {
	font-size: 1rem;
}

.logout {
	display: block;
	width: 100%;
}

.logoutbtn {
	font-size: 1rem;
	float: right;
}
</style>
