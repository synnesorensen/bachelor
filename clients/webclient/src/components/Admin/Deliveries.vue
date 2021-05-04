<template>
    <v-data-table
        dense
        :headers="headers"
        :items="users"
        item-key="fullname"
        class="elevation-1">
    </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getAllVendorsDeliveries, getVendorSubscriptions } from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces"

@Component({
	components: {},
})
export default class Deliveries extends Vue {
    private search = "";
    private start = "";
    private end = "";
    private users:interfaces.UserSubscription[] = [];
    private headers = [
        {
          text: "Navn",
          align: 'start',
          sortable: true,
          value: "fullname",
        },
        { text: "Boks", value: "box" },
        { text: "Antall", value: "noOfMeals" },
        { text: "Adresse", value: "address" },
        { text: "Telefon", value: "phone" },
        { text: "Epost", value: "email" },
        { text: "Allergies", value: "allergies" }
    ];

    async created() {
        let deliveries = await getAllVendorsDeliveries(this.start, this.end);
        const userSubscriptions = await getVendorSubscriptions();

        deliveries.forEach((del) => {
            let user = userSubscriptions.find(({userId}) => userId == del.userId);
            this.users.push(user);
        });
    }

}
</script>