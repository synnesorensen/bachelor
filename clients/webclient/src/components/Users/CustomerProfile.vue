<template>
    <v-container v-if="subscription">
        <div v-if="showUserprofile">
            <v-row>
                <v-col>
                    <h1 class="primary--text">Min profil</h1>
                </v-col>
                <v-col>
                    <v-btn
                        v-if="showUserprofile"
                        color="primary"
                        @click="sendToCustomerOrder"
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
                        v-for="allergy in allergies"
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
        </div>
        <div v-if="editUserprofile">
            <v-btn v-if="editUserprofile" color="secondary" @click="cancel"
                >Avbryt</v-btn
            >
            <CustomerOrder :loggedInUser="loggedInUser" />
        </div>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MenuItems } from "../../../../../server/src/interfaces";
import * as interfaces from "../../../../../server/src/interfaces";
import CustomerOrder from "./CustomerOrder.vue";
import { Prop } from "vue-property-decorator";
import api from "../../api/api";

@Component({
    components: {
        CustomerOrder,
    },
})
export default class CustomerProfile extends Vue {
    @Prop() userprofile!: interfaces.Userprofile;
    @Prop() loggedInUser!: string;
    private subscription: interfaces.VendorSubscription | null = null;
    private items: interfaces.MenuItems[] | null = [];
    private allergies = this.userprofile.allergies;
    private editUserprofile: boolean = false;
    private showUserprofile: boolean = true;

    sendToCustomerOrder() {
        this.editUserprofile = true;
        this.showUserprofile = false;
    }

    cancel() {
        this.editUserprofile = false;
        this.showUserprofile = true;
    }

    async created() {
        const subs = await api.getUserSubscriptions();

        if (subs != null) {
            this.items = subs[0].schedule;
            this.subscription = subs[0];
        }
    }
}
</script>

<style scoped>
ul {
    list-style-type: none;
    font-weight: 400;
}
</style>
