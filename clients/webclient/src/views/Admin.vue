<template>
	<v-container class="overflow-hidden" v-if="$store.getters.userprofile.isVendor">
		<v-app-bar 
            app 
            dark
            src="..\..\assets\smorblomst_crop1.jpg"
        >
            <template v-slot:img="{ props }">
                <v-img
                    v-bind="props"
                    gradient="to top right, rgba(100,115,100,.8), rgba(25,32,25,0)"
                    required
                >
                </v-img>
            </template>
			<v-toolbar-title 
                class="font-weight-medium"
            >
                Lunsj på  hjul
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-slot:extension>
                <v-tabs v-model="tab" align-with-title >
                    <v-tab>Kalender</v-tab>
                    <v-tab>Firmaprofil</v-tab>
                    <v-tab>Betalinger</v-tab>
                    <v-tab>Kundeliste</v-tab>
                </v-tabs>
            </template>
            <v-spacer />
            <v-btn 
                color="grey" 
                @click="logout">
                Logg ut
            </v-btn>
		</v-app-bar>
		<v-main>
            <v-container fluid>
                <v-tabs-items v-model="tab">
                    <v-tab-item><AdminOverview /></v-tab-item>
                    <v-tab-item><AdminProfile  /></v-tab-item>
                    <v-tab-item><AdminPayments /></v-tab-item>
                    <v-tab-item><AdminCustomers /></v-tab-item>
                </v-tabs-items>
            </v-container>
		</v-main>
	</v-container>
    <v-container v-else>
        <h1>Forbudt!</h1>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AdminOverview from '../components/Admin/AdminOverview.vue';
import AdminProfile from '../components/Admin/AdminProfile.vue';
import AdminPayments from '../components/Admin/AdminPayments.vue';
import AdminCustomers from '../components/Admin/AdminCustomers.vue'

@Component({
	components: {
        AdminOverview,
        AdminProfile, 
        AdminPayments,
        AdminCustomers
	},
})
export default class AppBar extends Vue {
	private tab = 0;

    logout() {
        this.$store.dispatch("logout");
    }
}
</script>