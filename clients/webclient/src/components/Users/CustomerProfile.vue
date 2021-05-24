<template>
    <v-container v-if="subscription">
        <div v-if="showUserprofile">
            <v-row>
                <v-col :cols="5">
                    <h1 class="primary--text">Min profil</h1>
                </v-col>
                <v-col>
                    <v-btn
                        v-if="showUserprofile"
                        color="primary"
                        @click="switchToCustomerEdit"
                    >
                        <v-icon left>mdi-pencil</v-icon>Endre profil
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Navn</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">
                        {{ userprofile.fullname }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Adresse</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ userprofile.address }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Telefonnummer</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ userprofile.phone }}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Epost</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ userprofile.email }}</p>
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
                        v-for="allergy in userprofile.allergies"
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
                    <p class="font-weight-light">
                        {{ subscription.noOfMeals }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-black">Valgt boks</p>
                </v-col>
                <v-col>
                    <p class="font-weight-light">{{ subscription.box }}</p>
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
                                    {{subscription.paused? "Aktiver" : "Sett på pause" }}
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
        <div v-if="editUserprofile">
            <v-row>
                <v-col>
                    <CustomerEdit
                        :userprofile="userprofile"
                        @switchToCustomerProfile="switchToCustomerProfile"
                    />
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Action, MenuItems, Userprofile, VendorSubscription } from "../../../../../server/src/interfaces";
import CustomerEdit from "./CustomerEdit.vue";
import { Prop } from "vue-property-decorator";
import api from "../../api/api";

@Component({
    components: {
        CustomerEdit,
    },
})
export default class CustomerProfile extends Vue {
    @Prop() userprofile!: Userprofile;
    @Prop() loggedInUser!: string;
    @Prop() subscription!: VendorSubscription;
    private items: MenuItems[] | null = [];
    private editUserprofile: boolean = false;
    private showUserprofile: boolean = true;
    private dialog: boolean = false;

    switchToCustomerEdit() {
        this.editUserprofile = true;
        this.showUserprofile = false;
    }

    switchToCustomerProfile() {
        this.editUserprofile = false;
        this.showUserprofile = true;
    }

    async created() {
        if (this.subscription?.schedule) {
            this.items = this.subscription.schedule;
        }
    }

    async toggleSubscriptionPause() {
        this.dialog = false;
        if (this.subscription) {
            let sub = await api.getUserSubscription(this.subscription.vendorId);
            if (sub) {
                this.subscription.paused = !this.subscription.paused;
                sub.paused = this.subscription.paused;
                let time = new Date(Date.now());
                if (time.getHours() < 10) {
                    time.setDate(time.getDate() + 1);
                } else {
                    time.setDate(time.getDate() + 2);
                }
                let action:Action = {
                    time: time.toISOString().substr(0, 10),
                    action: sub.paused? "pause" : "unpause"
                }
                await api.postSubscription(sub.vendorId, action);
                this.subscription.paused = sub.paused;
            }
        }
    }

    get buttonText() {
        if (this.subscription?.paused) {
            return "Aktiver abonnement";
        }
        return "Pause abonnement";
    }

    get dialogText() {
        if (this.subscription?.paused) {
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