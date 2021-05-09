<template>
    <v-container v-if="subscription"> 
         <v-row>
            <v-col>
                <v-btn v-if="showUserprofile" color="primary" @click="sendToCustomerOrder">
                    <v-icon left>mdi-pencil</v-icon>Endre profil
                </v-btn>
            </v-col>
        </v-row>
        <div v-if="showUserprofile">
        <v-row>
            <v-col>
                <h1 class="primary--text">Min profil</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2>
                    {{ userprofile.fullname }}
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ userprofile.address }}</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ userprofile.phone }}</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3>{{ userprofile.email }}</h3>
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
         <div v-if="editUserprofile">
            <CustomerOrder :loggedInUser="loggedInUser"/> 
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
