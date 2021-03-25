<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<v-icon class="pr-8" x-large color="white">mdi-bike</v-icon>
				<v-toolbar-title>Lunsj på midlertidige hjul</v-toolbar-title>
			</div>
			<v-spacer></v-spacer>
		</v-app-bar>
		<v-main>
			<v-tabs v-model="tab" align-with-title>
				<v-tab>Kundeoversikt</v-tab>
				<v-tab>Login</v-tab>
				<v-tab>Bestilling</v-tab>
				<v-tab>Profil</v-tab>
				<v-tab>Faktura</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tab">
				<v-tab-item><CustomerOverview /></v-tab-item>
				<v-tab-item><CustomerLogin /></v-tab-item>
				<v-tab-item><CustomerOrder /></v-tab-item>
				<v-tab-item><CustomerProfile /></v-tab-item>
				<v-tab-item>Her kommer faktuainfo</v-tab-item>
			</v-tabs-items>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CustomerOverview from './components/CustomerOverview.vue';
import CustomerLogin from './components/CustomerLogin.vue';
import CustomerOrder from './components/CustomerOrder.vue';
import CustomerProfile from './components/CustomerProfile.vue';

@Component({
	components: {
		CustomerOverview,
		CustomerLogin,
		CustomerOrder,
		CustomerProfile,
	},
})
export default class App extends Vue {
	private tab = 0;
}
</script>
