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
import { getAllVendorsDeliveries, getVendorSubscriptions } from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces"
import { Prop, Watch } from 'vue-property-decorator';

@Component({
	components: {},
})
export default class Deliveries extends Vue {
    @Prop() date!:string;
    private start = "";
    private end = "";
    private users:interfaces.UserSubscription[] = [];
    @Watch("date")
    async onDateChanged() {
        console.log(this.date)
        if (this.date) {
            let deliveries = await getAllVendorsDeliveries(this.date + "T00:00:00", this.date + "T23:59:00");
            let userSubscriptions = await getVendorSubscriptions();
            this.users = [];
            deliveries!.forEach((del) => {
                let user:interfaces.UserSubscription = userSubscriptions!.find(({userId}) => userId == del.userId);
                this.users.push(user);
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
        { text: "Boks", value: "box" },
        { text: "Antall", value: "noOfMeals" },
        { text: "Adresse", value: "address" },
        { text: "Telefon", value: "phone" },
        { text: "Epost", value: "email" },
        { text: "Allergier", value: "allergies" }
    ];

}
</script>