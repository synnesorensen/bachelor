<template>
    <v-container>
        <v-row>
            <v-col>
                <h1 class="primary--text">Min profil</h1>
            </v-col>
            <v-col>
                <v-btn color="primary" @click="sendToOrderForm"
                    >Endre profil</v-btn
                >
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- <h2 v-if="editButton !== clicked"> -->
                <h2>
                    {{ loggedInUser.fullname }}
                </h2>
                <!-- <v-else v-text-field label="Navn" v-model="fullname"></v-else> -->
            </v-col>
            <v-col>
                <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ loggedInUser.address }}</h3>
            </v-col>
            <v-col>
                <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ loggedInUser.phone }}</h3>
            </v-col>
            <v-col>
                <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ loggedInUser.email }}</h3>
            </v-col>
            <v-col>
                <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>
                    <label for="allergylist">Mine allergier:</label>
                </h3>
                <h4>
                    <ul>
                        <li
                            v-for="allergy in allergies"
                            :key="allergy"
                            id="allergylist"
                        >
                            {{ allergy }}
                        </li>
                    </ul>
                </h4>
            </v-col>
            <v-col>
                <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>Antall porsjoner: {{ subscription.noOfMeals }}</h3>
            </v-col>
            <v-col>
                <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>Valgt boks: {{ subscription.box }}</h3>
            </v-col>
            <v-col>
                <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- <h3>Leveringsdag: {{ items.day }}</h3> -->
                <h3>Leveringsdag:</h3>
                <div v-for="item in items" v-bind:key="item.id">
                    <p class="font-weight-light">
                        {{ item.day + "  -  " + item.menu }}
                    </p>
                </div>
            </v-col>
            <v-col>
                <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MenuItems } from "../../../../../server/src/interfaces";
import { getUserprofile, getUserSubscriptions } from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces";
import CustomerOrder from "./CustomerOrder.vue";

@Component
export default class CustomerProfile extends Vue {
    private loggedInUser: interfaces.Userprofile | null = null;
    private subscription: interfaces.VendorSubscription | null = null;
    private items: interfaces.MenuItems[] | null = [];
    private editProfile: CustomerOrder | null = null;
    private customerProfile: CustomerProfile | null = null;
    private allergies: string[] | null = null;

    async created() {
        const userprofile = await getUserprofile();
        const subs = await getUserSubscriptions();
        console.log(userprofile);
        console.log(subs);
        if (userprofile != null) {
            // const user = await getUserprofile();
            this.loggedInUser = userprofile;
            this.allergies = this.loggedInUser.allergies;
        }

        if (subs != null) {
            this.items = subs[0].schedule;
            this.subscription = subs[0];
        }

        // if (subs != null) {
        //     // const subscriptions = await getVendorSubscriptions();
        //     // const allUserSubs = await getUserSubscriptions();
        //     // const userSub = allUserSubs.find(({vendorId}) => vendorId == subscriptions[0].schedule);
        // }
    }

    // sendToOrderForm(component) {
    //    component = this.editProfile;
    // }
}
</script>
