<template>
	<v-container class="overflow-hidden" v-if="$store.getters.userprofile && $store.getters.subscription">
		<v-app-bar 
            app 
            dark
            src="..\..\assets\smorblomst_crop1.jpg"
        >
            <template v-slot:img="{ props }">
                <v-img
                    v-bind="props"
                    gradient="to top right, rgba(80,115,80,1), rgba(25,32,25,0)"
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
                    <v-tab @click="$refs.customerOverview.populateCalendar()">Kalender</v-tab>
                    <v-tab>Kundeprofil</v-tab>
                    <v-tab>Faktura</v-tab>
                    <v-tab>Informasjon</v-tab>
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
                    <v-tab-item><UserCalendar ref="customerOverview" /></v-tab-item>
                    <v-tab-item><CustomerProfileTabs /> </v-tab-item>
                    <v-tab-item><Invoice /></v-tab-item>
                    <v-tab-item><Information /></v-tab-item>
                </v-tabs-items>
            </v-container>
		</v-main>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import UserCalendar from '../components/Users/UserCalendar.vue';
import CustomerProfileTabs from '../components/Users/CustomerProfileTabs.vue';
import Invoice from '../components/Users/Invoice.vue';
import Information from '../components/Users/Information.vue';

@Component({
	components: {
		UserCalendar,
		CustomerProfileTabs,
		Invoice,
        Information
	},
})
export default class AppBar extends Vue {
	private tab = 0;

    logout() {
        this.$store.dispatch("logout");
    }
}
</script>