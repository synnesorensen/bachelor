<template>
	<v-container>
		<v-app-bar app flat color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<!-- TODO: Change these to use router at some point -->
			<v-tabs v-model="tab" align-with-title>
				<v-tab>Login</v-tab>
				<v-tab>Oversikt</v-tab>
				<v-tab>Fakturering</v-tab>
			</v-tabs>
		</v-app-bar>
		<v-main>
			<v-tabs-items v-model="tab">
				<v-tab-item><LoginDialog /></v-tab-item>
				<v-tab-item><AdminOverview /></v-tab-item>
				<v-tab-item><AdminInvoicing /></v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginDialog from '../LoginDialog/LoginDialog.vue';
import AdminOverview from './AdminOverview.vue';
import AdminInvoicing from './AdminInvoicing.vue';

@Component({
	components: {
		LoginDialog,
		AdminOverview,
		AdminInvoicing,
	},
})
export default class AdminNavBar extends Vue {
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
