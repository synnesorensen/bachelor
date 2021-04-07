<template>
	<v-header>
		<v-app-bar app color="primary" dark class="appbar">
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title class="titleName">Lunsj på midlertidige hjul</v-toolbar-title>
				<v-toolbar-items class="navbar">
					<!-- TODO: Buttons must be converted into router-link to="" -->
					<v-spacer></v-spacer>
                    <router-link>
						<v-btn text class="navbtn">Brukerprofil</v-btn>
					</router-link>
					<router-link>
						<v-btn text class="navbtn">Oversikt</v-btn>
					</router-link>
                    <router-link>
					<v-btn text class="navbtn">Faktura</v-btn>
					</router-link>
                    <router-link>
						<v-btn text class="navbtn">Bestilling</v-btn>
					</router-link>
				</v-toolbar-items>
                <v-spacer></v-spacer>
				<v-toolbar-items class="logout">
					<router-link>
						<v-btn text class="logoutbtn">Logg ut</v-btn>
					</router-link>
				</v-toolbar-items>
			</div>
		</v-app-bar>
	</v-header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

// TODO: Must be implemented in a separate .ts file
// import CustomerInvoice from './CustomerInvoice.vue';
// import CustomerProfile from './CustomerProfile.vue';
// import { createRouter, createWebHistory } from 'vue-router';

// const router = createRouter({
// 	history: createWebHistory(),
// 	routes: [
// 		{ path: './profile', name: 'Customer profile', component: CustomerProfile },
// 		{ path: './invoice', component: CustomerInvoice },
// 	],
// });

@Component
export default class CustomerNavBar extends Vue {}
</script>

<style scoped>
.appbar {
	width: 100%;
}

.titleName {
	width: 30%;
}

.navbar {
	width: 50%;
}

.navbtn {
	font-size: 1rem;
}

.logout {
	display: block;
	width: 20%;
}

.logoutbtn {
	font-size: 1rem;
	float: right;
}
</style>
