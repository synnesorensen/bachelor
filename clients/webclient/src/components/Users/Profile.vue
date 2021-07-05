<template>
    <v-container v-if="vendor">
        <v-row>
            <v-col>
                <v-card>
                    <v-app-bar
                        dark
                        color="#79b321"
                    >
                        <v-card-title>
                            Kundeprofil
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-btn 
                            icon
                            @click="editProfile"    
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </v-app-bar>
                    <v-card-text>
                        <br />
                        <v-row>
                            <v-col :xl="3">
                                <p class="font-weight-medium">Navn</p>
                            </v-col>
                            <v-col v-if="editModeProfile">
                                <v-text-field
                                    v-model="$store.getters.userprofile.fullname"
                                    solo
                                ></v-text-field>
                            </v-col>
                            <v-col v-else>
                                <p class="font-weight-light">{{ $store.getters.userprofile.fullname }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :xl="3">
                                <p class="font-weight-medium">Hjemmeadresse</p>
                            </v-col>
                            <v-col v-if="editModeProfile">
                                <v-text-field
                                    v-model="$store.getters.userprofile.address"
                                    solo
                                ></v-text-field>
                            </v-col>
                            <v-col v-else>
                                <p class="font-weight-light">{{ $store.getters.userprofile.address }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :xl="3">
                                <p class="font-weight-medium">Leveringsadresse</p>
                            </v-col>
                            <v-col v-if="editModeProfile">
                                <v-text-field
                                    v-model="$store.getters.userprofile.deliveryaddress"
                                    solo
                                ></v-text-field>
                            </v-col>
                            <v-col v-else>
                                <p class="font-weight-light">{{ $store.getters.userprofile.deliveryaddress }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :xl="3">
                                <p class="font-weight-medium">Telefonnummer</p>
                            </v-col>
                            <v-col v-if="editModeProfile">
                                <v-text-field
                                    v-model="$store.getters.userprofile.phone"
                                    :rules="[numbers, phoneNoLength]"
                                    solo
                                ></v-text-field>
                            </v-col>
                            <v-col v-else>
                                <p class="font-weight-light">{{ $store.getters.userprofile.phone }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :xl="3">
                                <p class="font-weight-medium">Epost</p>
                            </v-col>
                            <v-col>
                                <p class="font-weight-light">{{ $store.getters.userprofile.email }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :xl="3">
                                <p class="font-weight-medium">Allergier</p>
                            </v-col>
                            <v-col v-if="editModeProfile"
                                class="d-flex"
                                cols="12"
                                sm="6"
                            >
                                <v-select
                                v-model="selectedAllergies"
                                :items="allergies"
                                solo
                                chips
                                label="Velg alle aktuelle"
                                multiple
                                ></v-select>
                            </v-col>
                            <v-col v-else>
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
                    </v-card-text>
                    <v-card-actions v-if="editModeProfile">
                        <v-spacer></v-spacer>
                        <v-btn @click="cancelEditProfile" color="error">Avbryt</v-btn>
                        <v-btn @click="updateUserProfile" color="success">Lagre</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col>
                <v-card> 
                    <v-app-bar
                        dark
                        color="#79b321"
                    >
                        <v-card-title>
                            Abonnement
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-btn 
                            icon
                            @click="editSub"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </v-app-bar>
                    <v-card-text v-if="$store.getters.subscription">
                        <br />
                        <v-row>
                            <v-col>
                                <p class="font-weight-medium">Antall porsjoner</p>
                            </v-col>
                            <v-col v-if="editModeSub"
                                class="d-flex"
                                cols="12"
                                sm="6"
                            >
                                <v-select
                                v-model="selectedNoOfMeals"
                                :items="noOfMeals"
                                solo
                                label="Velg antall porsjoner"
                                ></v-select>
                            </v-col>
                            <v-col v-else>
                                <p class="font-weight-light">{{ $store.getters.subscription.noOfMeals }}</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <p class="font-weight-medium">Valgt boks</p>
                            </v-col>
                            <v-col v-if="editModeSub"
                                class="d-flex"
                                cols="12"
                                sm="6"
                            >
                                <v-select
                                v-model="selectedBox"
                                :items="boxes"
                                solo
                                label="Velg leveringsboks"
                                ></v-select>
                            </v-col>
                            <v-col v-else>
                                <p class="font-weight-light">{{ $store.getters.subscription.box }}</p>
                            </v-col>
                        </v-row>
                        <v-row v-if="!editModeSub">
                            <v-col>
                                <p class="font-weight-medium">Leveringsdag</p>
                            </v-col>
                            <v-col>
                                <p
                                    class="font-weight-light"
                                    v-for="item in $store.getters.subscription.schedule"
                                    v-bind:key="item.id"
                                >
                                    {{ item.day + ": " + item.menu }}
                                </p>
                            </v-col>
                        </v-row>
                        <v-row v-if="editModeSub">
                            <p class="font-weight-medium">Leveringsdag</p>
                        </v-row>
                        <v-row v-if="editModeSub">
                            <v-chip-group
                                v-model="selectedSchedule"
                                active-class="blue--text text--accent-4"
                                multiple
                            >
                                <v-chip
                                    v-for="item in vendorSchedule"
                                    v-bind:key="item"
                                    v-bind:value="item"
                                    v-model="item.selected"
                                    filter
                                    outlined
                                >
                                    {{ item.day + " " + item.menu }}
                                </v-chip>
                            </v-chip-group>
                        </v-row>
                    </v-card-text>
                    <v-card-actions v-if="editModeSub">
                        <v-spacer></v-spacer>
                        <v-btn @click="cancelEditSub" color="error">Avbryt</v-btn>
                        <v-btn @click="updateSubscription" color="success">Lagre</v-btn>
                    </v-card-actions>
                    <v-card-actions v-if="$store.getters.subscription">
                        <v-btn @click="dialog = true" text color="orange">
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
                    </v-card-actions>
                    <v-card-text v-if="!$store.getters.subscription">
                        <br />
                        <p class="font-weight-light">Du har ikke tegnet et abonnement. Dersom du ønsker faste leveringer en eller flere dager i uken, kan du sette opp et abonnement ved å trykke på knappen.</p>
                    </v-card-text>
                    <v-card-actions v-if="!$store.getters.subscription">
                        <v-btn text color="orange">Registrer et abonnement</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Action, MenuItems, Subscription, Vendor} from "../../../../../server/src/interfaces";
import CustomerEdit from "./CustomerEdit.vue";
import CustomerSubscriptionEdit from "./CustomerSubscriptionEdit.vue";
import api from "../../api/api";

@Component({
    components: {
        CustomerEdit,
        CustomerSubscriptionEdit
    },
})
export default class CustomerProfile extends Vue {
    private items: MenuItems[] | null = [];
    private dialog = false;
    private editModeProfile = false;
    private editModeSub = false;
    private allergies = ["Gluten","Skalldyr","Egg","Fisk","Peanøtter","Nøtter","Melk", "Soya", "Selleri","Sennep", "Sesam", "Svovel", "Lupin", "Bløtdyr"];
    private selectedAllergies: string[] = [];
    private noOfMeals = [1,2,3,4,5,6,7,8,9,10];
    private selectedNoOfMeals = 0;
    private boxes = ["Engangsboks", "Gjenbruksbokser (depositum kr 218)"];
    private selectedBox = "";
    private vendor: Vendor | null = null;
    private vendorSchedule: MenuItems[] = [];
    private selectedSchedule: string[] = [];

    async mounted() {
        this.selectedAllergies = this.$store.getters.userprofile.allergies;
        this.selectedNoOfMeals = this.$store.getters.subscription.noOfMeals;
        this.selectedBox = this.$store.getters.subscription.box;
        this.vendor = await api.getSingleVendor();
        this.vendorSchedule = this.vendor.schedule;
        this.selectedSchedule = this.$store.getters.subscription.schedule;
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
    
    editProfile() {
        this.editModeProfile = true;
    }

    editSub() {
        this.editModeSub = true;
    }

    async updateUserProfile() {
        let updated = this.$store.getters.userprofile;
        this.$store.getters.userprofile.allergies = this.selectedAllergies;
        await api.putUserprofile(updated);
        this.editModeProfile = false;
    }

    async cancelEditProfile() {
        let unchangedUserprofile = await api.getUserprofile();
        if (unchangedUserprofile) {
            this.$store.getters.userprofile.fullname = unchangedUserprofile.fullname;
            this.$store.getters.userprofile.address = unchangedUserprofile.address;
            this.$store.getters.userprofile.phone = unchangedUserprofile.phone;
            this.$store.getters.userprofile.email = unchangedUserprofile.email;
            this.$store.getters.userprofile.allergies = unchangedUserprofile.allergies;
        }
        this.editModeProfile = false;
        this.selectedAllergies = [];
    }

    async updateSubscription() {
        console.log(this.selectedSchedule);
        let sub: Subscription = {
                vendorId: this.$store.getters.subscription.vendorId,
                userId: this.$store.getters.userprofile.email,
                approved: false,
                paused: false,
                schedule: this.selectedSchedule,
                noOfMeals: this.selectedNoOfMeals,
                box: this.selectedBox,
            };
            await api.putUserSubscription(sub);
        this.editModeSub = false;
    }

    async cancelEditSub() {
        let unchangedSub = await api.getSingleSubscription();
        if (unchangedSub) {
            this.$store.getters.subscription.selectedNoOfMeals = unchangedSub.noOfMeals;
            this.$store.getters.subscription.selectedDeliveryDays = unchangedSub.schedule;
            this.$store.getters.subscription.selectedBox = unchangedSub.box;
        }
        this.editModeSub = false;
    }

    // Rules
    numbers(value: string) {
        return (!isNaN(parseInt(value)) || "Vennligst oppgi et gyldig nummer");
    }
    phoneNoLength(value: string) {
        return value.length >= 8 || "Vennligst oppgi et gyldig telefonnummer (8 siffer)";
    }
}
</script>