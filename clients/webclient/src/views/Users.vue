<template>
	<v-container class="overflow-hidden" v-if="$store.getters.userprofile">
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
                class="font-weight-medium"
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
                        <v-list-item-title @click="tab=2; drawer= false">Faktura</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title @click="tab=3; drawer= false">Informasjon</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
		<v-main>
            <v-container fluid>
                <v-tabs-items v-model="tab">
                    <v-tab-item><UserCalendar ref="customerOverview" /></v-tab-item>
                    <v-tab-item><Profile /> </v-tab-item>
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
import Profile from '../components/Users/Profile.vue';
import Invoice from '../components/Users/Invoice.vue';
import Information from '../components/Users/Information.vue';

@Component({
	components: {
		UserCalendar,
		Profile,
		Invoice,
        Information
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