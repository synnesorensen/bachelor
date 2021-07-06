<template>
	<v-container class="overflow-hidden" v-if="$store.getters.userprofile.isVendor">
		<v-app-bar 
            app 
            dark
            src="..\..\assets\smorblomst_crop1.jpg"
        >
            <v-app-bar-nav-icon @click="drawer = true" class="d-flex d-sm-none"></v-app-bar-nav-icon>
            <template v-slot:img="{ props }">
                <v-img
                    v-bind="props"
                    gradient="to top right, rgba(80,115,80,1), rgba(25,32,25,0)"
                    required
                >
                </v-img>
            </template>
			<v-toolbar-title 
                class="headline"
            >
                Lunsj på  hjul
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-slot:extension>
                <v-tabs 
                    v-model="tab" 
                    align-with-title 
                    class="d-none d-sm-flex"
                >
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
        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
        >
            <v-list nav dense>
                <v-list-item-group>
                    <v-list-item>
                        <v-list-item-title @click="tab=0; drawer= false">Kalender</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title @click="tab=1; drawer= false">Profil</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title @click="tab=2; drawer= false">Betalinger</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title @click="tab=3; drawer= false">Kundeliste</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
		<v-main>
            <v-container fluid>
                <v-tabs-items v-model="tab">
                    <v-tab-item><AdminCalendar /></v-tab-item>
                    <v-tab-item><Profile  /></v-tab-item>
                    <v-tab-item><Payments /></v-tab-item>
                    <v-tab-item><Customers /></v-tab-item>
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
import AdminCalendar from '../components/Admin/AdminCalendar.vue';
import Profile from '../components/Admin/Profile.vue';
import Payments from '../components/Admin/Payments.vue';
import Customers from '../components/Admin/Customers.vue'

@Component({
	components: {
        AdminCalendar,
        Profile, 
        Payments,
        Customers
	},
})
export default class AppBar extends Vue {
	private tab = 0;
    private drawer = false;

    logout() {
        this.$store.dispatch("logout");
    }
}
</script>