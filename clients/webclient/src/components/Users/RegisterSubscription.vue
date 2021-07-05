<template>
    <v-container>
        <v-form v-model="isFormValid">
            <v-row>
                <v-col>
                    <h1>Registrere abonnement</h1>
                </v-col>
            </v-row>
            <v-row>
                <p class="font-weight-medium">Antall porsjoner:</p>
            </v-row>
            <v-row>
                <v-chip-group
                    v-model="selectedNoOfMeals"
                    active-class="blue--text text--accent-4"
                    mandatory
                >
                    <v-chip
                        v-for="meal in meals"
                        v-bind:key="meal.no"
                        v-bind:value="meal.no"
                        v-model="meal.selected"
                        filter
                        outlined
                    >
                        {{ meal.no }}
                    </v-chip>
                </v-chip-group>
            </v-row>
            <v-row>
                <p class="font-weight-medium">Leveringsdag(er):</p>
            </v-row>
            <v-row>
                <v-chip-group
                    v-model="selectedDeliveryDays"
                    active-class="blue--text text--accent-4"
                    multiple
                >
                    <v-chip
                        v-for="deliveryDay in deliveryDays"
                        v-bind:key="deliveryDay.id"
                        v-bind:value="deliveryDay.id"
                        v-model="deliveryDay.selected"
                        filter
                        outlined
                    >
                        {{ deliveryDay.day + " " + deliveryDay.menu }}
                    </v-chip>
                </v-chip-group>
            </v-row>
            <v-row>
                <p class="font-weight-medium">Type boks:</p>
            </v-row>
            <v-row>
                <v-chip-group
                    v-model="selectedBox"
                    active-class="blue--text text--accent-4"
                    mandatory
                >
                    <v-chip
                        v-for="box in boxes"
                        v-bind:key="box.type"
                        v-bind:value="box.type"
                        v-model="box.selected"
                        filter
                        outlined
                    >
                        {{ box.type }}
                    </v-chip>
                </v-chip-group>
            </v-row>
        </v-form>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../../api/api";
import { MenuItems, Subscription, Vendor} from "../../../../../server/src/interfaces";

@Component
export default class CustomerOrder extends Vue {
    private isFormValid = false;
    private vendor: Vendor | null = null;
    private meals = [
        { no: 1, selected: false },
        { no: 2, selected: false },
        { no: 3, selected: false },
        { no: 4, selected: false },
        { no: 5, selected: false },
        { no: 6, selected: false },
        { no: 7, selected: false },
        { no: 8, selected: false },
        { no: 9, selected: false },
        { no: 10, selected: false },
    ];
    private selectedNoOfMeals = 1;
    private deliveryDays: MenuItems[] = [];
    private selectedDeliveryDays = [];
    private boxes = [
        { type: "Engangsboks", selected: false },
        { type: "Gjenbruksbokser (depositum kr 218)", selected: false },
    ];
    private selectedBox = "";

    async getVendor() {
        this.vendor = await api.getSingleVendor();
        if (this.vendor) {
            this.deliveryDays = this.vendor.schedule;
        }
    }

    async sendToDb() {
        let subscription:Subscription = {
            vendorId: this.vendor!.vendorId,
            userId: this.$store.getters.loggedInUser,
            approved: false,
            paused: false,
            schedule: this.selectedDeliveryDays,
            noOfMeals: this.selectedNoOfMeals,
            box: this.selectedBox
        };
        await api.putUserSubscription(subscription);
        let newSubscription = api.getSingleSubscription();
        this.$emit("newSubscription", newSubscription);
    }


}
</script>