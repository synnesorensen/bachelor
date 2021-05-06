<template>
    <v-container> 
         <v-row>
            <v-col>
                <v-btn color="primary" @click="sendToCustomerOrder">
                    <v-icon left>mdi-pencil</v-icon>Endre profil
                </v-btn>
            </v-col>
        </v-row>
        <div v-if="editUserprofile = true">
        <v-row>
            <v-col>
                <h1 class="primary--text">Min profil</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2>
                    {{ loggedInUser.fullname }}
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ loggedInUser.address }}</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ loggedInUser.phone }}</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ loggedInUser.email }}</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>
                    <label for="allergylist">Mine allergier:</label>
                </h3>
                <p>
                    <ul>
                        <li
                            v-for="allergy in allergies"
                            :key="allergy"
                            id="allergylist">
                            {{ allergy }}
                        </li>
                    </ul>
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>Antall porsjoner: {{ subscription.noOfMeals }}</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>Valgt boks: {{ subscription.box }}</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>Leveringsdag:</h3>
                <p>
                    <ul v-for="item in items" v-bind:key="item.id">
                        <li>
                            {{ item.day + "  -  " + item.menu }}
                        </li>
                    </ul>
                </p>
            </v-col>
        </v-row>
        </div>
         <div v-if="editUserprofile = true">
            <CustomerOrder /> 
        </div>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MenuItems } from "../../../../../server/src/interfaces";
import { getUserprofile, getUserSubscriptions } from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces";
import CustomerOrder from "./CustomerOrder.vue";

@Component({
    components: {
        CustomerOrder,
    },
})
export default class CustomerProfile extends Vue {
    private loggedInUser: interfaces.Userprofile | null = null;
    private subscription: interfaces.VendorSubscription | null = null;
    private items: interfaces.MenuItems[] | null = [];
    private allergies: string[] | null = null;
    private editUserprofile: boolean = false; 

    sendToCustomerOrder() {
        console.log("button clicked");
        this.editUserprofile = true;
    }

    async created() {
        const userprofile = await getUserprofile();
        const subs = await getUserSubscriptions();
        if (userprofile != null) {
            this.loggedInUser = userprofile;
            this.allergies = this.loggedInUser.allergies;
        }

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
