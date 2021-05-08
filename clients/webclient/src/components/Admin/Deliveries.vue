<template>
    <v-data-table
        dense
        :headers="headers"
        :items="users"
        item-key="userId"
        class="elevation-1">
    </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import api from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces"
import { Prop, Watch } from 'vue-property-decorator';

@Component({
	components: {},
})
export default class Deliveries extends Vue {
    @Prop() date!: string;
    private start = "";
    private end = "";
    private users:interfaces.UserSubscription[] = [];
    @Watch("date")
    async onDateChanged() {
        if (this.date) {
            console.log("I Deliveries ", this.date)
            let startDate = new Date(this.date+"T00:00:00");
            let endDate = new Date(this.date+"T23:59:59");
            let UTCStartDate = startDate.toISOString();
            let UTCEndDate = endDate.toISOString();
            let deliveries = await api.getAllVendorsDeliveries(UTCStartDate, UTCEndDate);
            let userSubscriptions = await api.getVendorSubscriptions();
            this.users = [];
            deliveries!.forEach((del: any) => {
                let user = userSubscriptions!.find(({userId}) => userId == del.userId);
                if (user) {
                    this.users.push(user);
                }
            });
        }
    }
    private headers = [
        {
          text: "Navn",
          align: 'start',
          sortable: true,
          value: "fullname",
        },
        { text: "Adresse", value: "address" },
        { text: "Telefon", value: "phone" },
        { text: "Boks", value: "box" },
        { text: "Antall", value: "noOfMeals" },
        { text: "Allergier", value: "allergies" }
    ];

}
</script>