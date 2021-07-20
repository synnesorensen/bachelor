<template>
	<v-container class="overflow-hidden" v-if="$store.getters.userprofile && $store.getters.userprofile.isVendor">
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
                    align-with-title 
                    class="d-none d-sm-flex"
                >
                    <v-tab to="/admin/calendar">Kalender</v-tab>
                    <v-tab to="/admin/profile">Firmaprofil</v-tab>
                    <v-tab to="/admin/payments">Betalinger</v-tab>
                    <v-tab to="/admin/customers">Kundeliste</v-tab>
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
                    <v-list-item
                        v-for="tab in tabs"
                        :key="tab.title"
                        router :to="tab.route"
                    >
                        <v-list-item-title>{{ tab.title }}</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
		<v-main>
            <router-view></router-view>
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
    private drawer = false;
    private tabs = [{
        title: "Kalender",
        route: "/admin/calendar"
    },
    {
        title: "Profil",
        route: "/admin/profile"
    },
    {
        title: "Betalinger",
        route: "/admin/payments"
    },
    {
        title: "Kundeliste",
        route: "/admin/customers"
    }];

    logout() {
        this.$store.dispatch("logout");
    }
}
</script>