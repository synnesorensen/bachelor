<template>
	<v-app>
		<v-main>
            <CustomerNavBar v-if="!isAdmin" />
            <AdminNavBar v-else />
	    </v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CustomerNavBar from './components/CustomerNavBar.vue';
import AdminNavBar from './components/Admin/AdminNavBar.vue';

@Component({
	components: {
		CustomerNavBar,
        AdminNavBar
	},
})
export default class App extends Vue {
    private isAdmin = false;


}
</script>
