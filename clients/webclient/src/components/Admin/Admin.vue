<template>
	<v-app>
		<admin-nav-bar></admin-nav-bar>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AdminNavBar from './AdminNavBar.vue';

@Component({
	components: {
		AdminNavBar,
	},
})
export default class Admin extends Vue {}
</script>
