<template>
    <v-form>
        <v-container>
            <v-row>
                <h1 class="primary--text">Endre abonnement</h1>
            </v-row>
            <v-row>
                <h4>Antall porsjoner</h4>
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
                <h4>Velg leveringsdager</h4>
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
                <h4>Hvilken type bokser ønsker du?</h4>
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
            <v-row>
                <v-text-field
                    label="Annen informasjon du vil legge til?"
                    v-model="add"
                ></v-text-field>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn @click="sendToDb" color="primary" class="ma-1"
                        >Send inn</v-btn
                    >
                    <v-btn @click="cancel" color="secondary" class="ma-1"
                        >Avbryt</v-btn
                    >
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import api from "../../api/api";
import {
    MenuItems,
    Subscription,
    Userprofile,
    Vendor,
    VendorSubscription,
} from "../../../../../server/src/interfaces";

@Component
export default class CustomerOrder extends Vue {
    @Prop() userprofile!: Userprofile;
    @Prop() loggedInUser!: string;
    @Prop() subscription!: VendorSubscription;
    private vendor: Vendor | null = null;
    private pushSchedule: any = [];
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
    private selectedNoOfMeals = this.subscription.noOfMeals;
    private deliveryDays = [];
    private selectedDeliveryDays = [];

    private boxes = [
        { type: "Engangsboks", selected: false },
        { type: "Gjenbruksbokser (depositum kr 218)", selected: false },
    ];
    private selectedBox = "";
    private allergies = [
        { name: "Gluten", selected: false },
        { name: "Skalldyr", selected: false },
        { name: "Egg", selected: false },
        { name: "Fisk", selected: false },
        { name: "Peanøtter", selected: false },
        { name: "Nøtter", selected: false },
        { name: "Melk", selected: false },
        { name: "Soya", selected: false },
        { name: "Selleri", selected: false },
        { name: "Sennep", selected: false },
        { name: "Sesam", selected: false },
        { name: "Svovel", selected: false },
        { name: "Lupin", selected: false },
        { name: "Bløtdyr", selected: false },
    ];
    private selectedAllergies = [];
    private add = "";

    // Rules:
    numbers(value: string) {
        return (
            !isNaN(parseInt(value)) || "Vennligst oppgi et gyldig postnummer"
        );
    }
    postNoLength(value: string) {
        return value.length == 4 || "Vennligst oppgi et gyldig postnummer";
    }
    phoneNoLength(value: string) {
        return value.length >= 8 || "Vennligst oppgi et gyldig telefonnummer";
    }

    logout() {
        this.$emit("logout");
    }

    async listDays() {
        this.vendor = await api.getSingleVendor();
        this.deliveryDays = this.vendor.schedule;
    }

    async sendToDb() {
        if (this.vendor?.vendorId) {
            let sub: Subscription = {
                vendorId: this.subscription.vendorId,
                userId: this.userprofile.email,
                approved: false,
                paused: false,
                schedule: this.selectedDeliveryDays,
                noOfMeals: this.selectedNoOfMeals,
                box: this.selectedBox,
            };

            //this.subscription.schedule = this.selectedDeliveryDays;
            await api.putUserSubscription(sub);
            console.log(this.subscription);
        }
    }

    async cancel() {
        let unchangedSubscription = await api.getSingleSubscription();
        if (unchangedSubscription) {
            this.selectedNoOfMeals = unchangedSubscription.noOfMeals;
            this.selectedDeliveryDays = unchangedSubscription.schedule;
            this.selectedBox = unchangedSubscription.box;
        }
    }
    async beforeMount() {
        this.listDays();
    }
}
</script>
