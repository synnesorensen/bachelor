<template>
<v-container>
    <v-data-table
        :loading="loading"
        dense
        :headers="headers"
        :items="users"
        class="elevation-1">
        <template v-slot:item="{ item }">
            <tr :key="item.userId">
                <td class ="handle" ><v-btn icon><v-icon small>mdi-cursor-move</v-icon></v-btn></td>
                <td>{{item.fullname}}</td>
                <td>{{item.address}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.box}}</td>
                <td>{{item.noOfMeals}}</td>
                <td>{{item.allergies.toString()}}</td>
            </tr>
        </template>
    </v-data-table>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import api from "../../api/api";
import {Delivery, UserSubscription} from "../../../../../server/src/interfaces"
import { Prop, Watch } from 'vue-property-decorator';
import Sortable from 'sortablejs'

@Component({
	components: {},
})
export default class Deliveries extends Vue {
    private loading = false;
    @Prop() date!: string;
    private start = "";
    private end = "";
    private users:UserSubscription[] = [];


    @Watch("date", { immediate: true })
    async onDateChanged() {
        if (this.date) {
            let startDate = new Date(this.date+"T00:00:00");
            let endDate = new Date(this.date+"T23:59:59");
            let UTCStartDate = startDate.toISOString();
            let UTCEndDate = endDate.toISOString();
            this.loading = true;
            try {
                let deliveries = await api.getAllVendorsDeliveries(UTCStartDate, UTCEndDate);
                let userSubscriptions = await api.getVendorSubscriptions();
                this.users = [];
                deliveries!.forEach((del:Delivery) => {
                    let user = userSubscriptions!.find(({userId}) => userId == del.userId);
                    if (user) {
                        this.users.push(user);
                    }
                });
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false;
            }
            
        }
    }
    private headers = [
        {
            text: "",
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
        let table = document.querySelector(".v-data-table__wrapper tbody") as HTMLElement;
        const _self = this;
        if (table) {
            Sortable.create(table, {
            handle: ".handle",
            animation: 150,
            onEnd({newIndex, oldIndex}) {
                const rowSelected = _self.users.splice(oldIndex!, 1)[0];
                _self.users.splice(newIndex!, 0, rowSelected);
            }
        });
        }
    }
}
</script>

<style scoped>
.handle {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
}
</style>