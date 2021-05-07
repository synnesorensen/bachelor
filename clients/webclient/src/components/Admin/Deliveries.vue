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
import { Api } from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces"
import { Prop, Watch } from 'vue-property-decorator';

@Component({
	components: {},
})
export default class Deliveries extends Vue {
    @Prop() date!:string;
    private api = new Api();
    private start = "";
    private end = "";
    private users:interfaces.UserSubscription[] = [];
    @Watch("date")
    async onDateChanged() {
        if (this.date) {
            let deliveries = await this.api.getAllVendorsDeliveries(this.date + "T00:00:00", this.date + "T23:59:00");
            let userSubscriptions = await this.api.getVendorSubscriptions();
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
        { text: "Adresse", value: "address" },
        { text: "Telefon", value: "phone" },
        { text: "Boks", value: "box" },
        { text: "Antall", value: "noOfMeals" },
        { text: "Allergier", value: "allergies" }
    ];

}
</script>