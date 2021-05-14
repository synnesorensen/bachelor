<template>
<v-container>
    <v-data-table
        dense
        :headers="headers"
        :items="users"
        class="elevation-1">
        <template v-slot:item="props">
            <tr :key="props.item.userId">
                <td><v-btn v-on="on" style="cursor: move" icon class="ec-sort-handle">::</v-btn></td>
                <td>{{props.item.fullname}}</td>
                <td>{{props.item.address}}</td>
            </tr>
        </template>
    </v-data-table>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import api from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces"
import { Prop, Watch } from 'vue-property-decorator';
import Sortable from 'sortablejs'

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
            text: "sort",
            align: "left",
            sortable: false
        },
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

    mounted() {
        let table = document.querySelector(".v-datatable tbody") as HTMLElement;
        const _self = this;
        Sortable.create(table, {
            handle: ".handle",
            onEnd({newIndex, oldIndex}) {
                const rowSelected = _self.users.splice(oldIndex, 1)[0];
                _self.users.splice(newIndex, 0, rowSelected);
            }
        });
    }
}
</script>

<style scoped>
.handle {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
}
</style>