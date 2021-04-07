<template>
	<v-header>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title>Lunsj på midlertidige hjul</v-toolbar-title>
				<v-toolbar-items class="navbar">
					<!-- TODO: Buttons must be converted into router-link to="" -->
					<v-btn plain class="navbtn">Brukerprofil</v-btn>
					<v-btn plain class="navbtn">Oversikt</v-btn>
					<v-btn plain class="navbtn">Faktura</v-btn>
					<v-btn plain class="navbtn">Bestilling</v-btn>
					<v-btn plain class="navbtn">Logg ut</v-btn>
				</v-toolbar-items>
			</div>
		</v-app-bar>
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
export default class CustomerNavBar extends Vue {}
</script>

<style scoped>
.navbtn {
	color: white;
	font-size: 1.2rem;
}
</style>
