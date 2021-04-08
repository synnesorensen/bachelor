<template>
	<v-app>
		<customer-nav-bar></customer-nav-bar>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CustomerNavBar from './components/CustomerNavBar.vue';

@Component({
	components: {
		CustomerNavBar,
	},
})
export default class App extends Vue {}
</script>
