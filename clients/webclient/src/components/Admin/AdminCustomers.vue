<template>
    <v-container>
        <v-card>
            <v-card-title>
                Kunder med aktiv abonnement
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Søk"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                dense
                :headers="headers"
                :items="activeUsers"
                item-key="userId"
                :search="search"
                class="elevation-1">
            </v-data-table>
        </v-card>
        <br />
        <v-card>
            <v-card-title>
                Kunder med abonnement på pause
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Søk"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                dense
                :headers="headers"
                :items="pausedUsers"
                item-key="userId"
                :search="search"
                class="elevation-1">
            </v-data-table>
        </v-card>
        <br />
        <v-card>
            <v-card-title>
                Kunder til godkjenning
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Søk"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                dense
                :headers="headers"
                :items="unapprovedUsers"
                item-key="userId"
                :search="search"
                class="elevation-1">
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import api from "../../api/api";
import Component from 'vue-class-component';
import * as interfaces from "../../../../../server/src/interfaces";

@Component({
	components: {
	},
})
export default class AdminCustomers extends Vue {
    private activeUsers: any[] = [];
    private pausedUsers: any[] = [];
    private unapprovedUsers: any[] = [];
    private search = "";
    private headers = [
        {
          text: "Navn",
          align: 'start',
          sortable: true,
          value: "fullname",
        },
        { text: "Adresse", value: "address" },
        { text: "Telefon", value: "phone" },
        { text: "Epost", value: "email" },
        { text: "Boks", value: "box" },
        { text: "Antall", value: "noOfMeals" },
        { text: "Allergier", value: "allergies" },
        { text: "Leveringsdager", value: "days" }
    ];

    async created() {
        let users = await api.getVendorSubscriptions();
        users.forEach((user) => {
            let days: string[] = [];
            user.schedule.forEach((item) => {
                days.push(item.day)
            });
            if (user.approved) {
                if (user.paused) {
                    this.pausedUsers.push({
                        fullname: user.fullname,
                        address: user.address,
                        phone: user.phone,
                        email: user.email,
                        box: user.box,
                        noOfMeals: user.noOfMeals,
                        allergies: user.allergies,
                        days: days
                    });
                } else {
                    this.activeUsers.push({
                        fullname: user.fullname,
                        address: user.address,
                        phone: user.phone,
                        email: user.email,
                        box: user.box,
                        noOfMeals: user.noOfMeals,
                        allergies: user.allergies,
                        days: days
                    });
                }
            } else {
                this.unapprovedUsers.push({
                    fullname: user.fullname,
                    address: user.address,
                    phone: user.phone,
                    email: user.email,
                    box: user.box,
                    noOfMeals: user.noOfMeals,
                    allergies: user.allergies,
                    days: days
                });
            }
            
        });
    }
}
</script>