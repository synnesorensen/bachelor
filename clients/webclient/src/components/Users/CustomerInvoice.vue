<template>
	<v-container v-if="subscription">
		<v-row>
            <v-col :cols="2">
                <p class="font-weight-medium"> Siste levering i denne perioden: </p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ toLocalPresentation(lastPaid)}} </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col :cols="2">
                <p class="font-weight-medium"> Neste faktura må betales innen: </p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{nextInvoice}} </p>
            </v-col>
        </v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import  api from "../../api/api";
import { VendorSubscription, Userprofile } from "../../../../../server/src/interfaces";

@Component

export default class CustomerInvoice extends Vue {
    @Prop() userprofile!: Userprofile;
    @Prop() subscription!: VendorSubscription;
    get lastPaid() {
        if (this.subscription?.lastDeliveryDate) {
            return this.subscription.lastDeliveryDate;
        } 
        return "";
    }
    get nextInvoice() {
        if (this.subscription) {
            let dateForLastDelivery = new Date(this.lastPaid);
            dateForLastDelivery.setMonth(dateForLastDelivery.getMonth() + 1, 1);
            let nextInvoiceDate = new Date(dateForLastDelivery);
            if (this.subscription.paused == true) {
                return "Abonnementet ditt er satt på pause. Du vil ikke få ny faktura før abonnementet startes igjen."
            } else {
                return nextInvoiceDate.toISOString().substr(0,10);
            }
        }
        return "";
    }

    toLocalPresentation(lastDeliveryDate: string) {
        const delDate = new Date(lastDeliveryDate);
        return delDate.toLocaleDateString();
    }
}
</script>