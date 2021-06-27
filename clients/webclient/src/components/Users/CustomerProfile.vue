<template>
    <v-container>
        <div>
            <v-row>
                <v-col :cols="5">
                    <h1 class="primary--text">Min profil</h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Navn</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ $store.getters.userprofile.fullname }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Hjemmeadresse</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ $store.getters.userprofile.address }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Leveringsadresse</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ $store.getters.userprofile.deliveryaddress }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Telefonnummer</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ $store.getters.userprofile.phone }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Epost</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ $store.getters.userprofile.email }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">
                        <label for="allergylist">Mine allergier</label>
                    </p>
                </v-col>
                <v-col>
                    <p
                        class="font-weight-light"
                        v-for="allergy in $store.getters.userprofile.allergies"
                        :key="allergy"
                        id="allergylist"
                    >
                        {{ allergy }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Antall porsjoner</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ $store.getters.subscription.noOfMeals }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Valgt boks</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ $store.getters.subscription.box }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Leveringsdag</p>
                </v-col>
                <v-col>
                    <p
                        class="font-weight-light"
                        v-for="item in items"
                        v-bind:key="item.id"
                    >
                        {{ item.day + "  -  " + item.menu }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-btn @click="dialog = true" color="primary">
                    {{ this.buttonText }}
                </v-btn>
                <v-dialog v-model="dialog" persistent max-width="300">
                    <v-card>
                        <v-container>
                            <v-card-title class="headline">
                                {{ this.buttonText }}
                            </v-card-title>
                            <v-card-text> {{ this.dialogText }} </v-card-text>
                            <v-row class="pa-4" align="center" justify="center">
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="toggleSubscriptionPause()"
                                >
                                    {{ $store.getters.subscription.paused? "Aktiver": "Sett på pause" }}
                                </v-btn>
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="dialog = false"
                                >
                                    Avbryt
                                </v-btn>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-dialog>
            </v-row>
        </div>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Action, MenuItems, Userprofile, VendorSubscription} from "../../../../../server/src/interfaces";
import CustomerEdit from "./CustomerEdit.vue";
import CustomerSubscriptionEdit from "./CustomerSubscriptionEdit.vue";
import { Prop } from "vue-property-decorator";
import api from "../../api/api";

@Component({
    components: {
        CustomerEdit,
        CustomerSubscriptionEdit
    },
})
export default class CustomerProfile extends Vue {
    private items: MenuItems[] | null = [];
    private editUserprofile = false;
    private showUserprofile = true;
    private editSubscription = false;
    private dialog = false;

    switchToCustomerEdit() {
        this.editUserprofile = true;
        this.showUserprofile = false;
        this.editSubscription = false;
    }

    switchToCustomerProfile() {
        this.editUserprofile = false;
        this.showUserprofile = true;
        this.editSubscription = false;
    }

    switchToSubscriptionEdit() {
        this.editUserprofile = false;
        this.showUserprofile = false;
        this.editSubscription = true;
    }

    async created() {
        if (this.$store.getters.subscription?.schedule) {
            this.items = this.$store.getters.subscription.schedule;
        }
    }

    async toggleSubscriptionPause() {
        this.dialog = false;
        if (this.$store.getters.subscription) {
            let sub = await api.getUserSubscription(this.$store.getters.subscription.vendorId);
            if (sub) {
                this.$store.getters.subscription.paused = !this.$store.getters.subscription.paused;
                sub.paused = this.$store.getters.subscription.paused;
                let time = new Date(Date.now());
                if (time.getHours() < 10) {
                    time.setDate(time.getDate() + 1);
                } else {
                    time.setDate(time.getDate() + 2);
                }
                let action: Action = {
                    time: time.toISOString().substr(0, 10),
                    action: sub.paused ? "pause" : "unpause",
                };
                await api.postSubscription(sub.vendorId, action);
                this.$store.getters.subscription.paused = sub.paused;
            }
        }
    }

    get buttonText() {
        if (this.$store.getters.subscription?.paused) {
            return "Aktiver abonnement";
        }
        return "Pause abonnement";
    }

    get dialogText() {
        if (this.$store.getters.subscription?.paused) {
            return "Du aktiverer nå ditt abonnement igjen. \
            Sjekk din kalender for å se når leveranser du eventuelt har til gode \
            vil bli levert. ";
        }
        return "Ved å sette ditt abonnement på pause vil dine kommende leveranser bli avbestilt.\
        Disse vil du få tilbake når du starter opp igjen abonnementet ditt. \
        Hvis du setter abonnementet ditt på pause etter klokken 10:00 dagen før du har en levering, \
        vil denne leveransen fortsatt bli levert. \
        Sjekk din kalender for å se når din siste levering er.";
    }
}
</script>