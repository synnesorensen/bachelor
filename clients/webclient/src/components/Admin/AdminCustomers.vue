<template>
    <v-container>
        <p class="font-weight-medium">Aktive kunder</p>
        <v-data-table
            dense
            :headers="headers"
            :items="activeUsers"
            item-key="userId"
            class="elevation-1">
        </v-data-table>
        <br />
        <p class="font-weight-medium">Pausede kunder</p>
        <v-data-table
            dense
            :headers="headers"
            :items="pausedUsers"
            item-key="userId"
            class="elevation-1">
        </v-data-table>
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
    private activeUsers: interfaces.UserSubscription[] = [];
    private pausedUsers: interfaces.UserSubscription[] = [];
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
        { text: "Godkjent", value: "approved" },
        { text: "Pause", value: "paused" },
        { text: "Leveringsdager", value: "schedule" }
    ];

    async created() {
        let users = await api.getVendorSubscriptions();
        users.forEach((user) => {
            if (user.paused) {
                this.pausedUsers.push(user);
            } else {
                this.activeUsers.push(user);
            }
        })
    }
}
</script>