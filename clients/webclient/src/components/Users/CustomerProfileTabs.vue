<template>
    <v-container>
        <v-tabs v-model="tab">
            <v-tab>Min Profil</v-tab>
            <v-tab>Endre min profil</v-tab>
            <v-tab>Endre mitt abonnement</v-tab>
        </v-tabs>
        <v-spacer />
        <v-tabs-items v-model="tab">
            <v-tab-item
                ><CustomerProfile
                    :userprofile="userprofile"
                    :subscription="subscription"
                    ref="customerOverview"
            /></v-tab-item>
            <v-tab-item
                ><CustomerEdit
                    :userprofile="userprofile"
                    :subscription="subscription"
                    :loggedInUser="loggedInUser"
                />
            </v-tab-item>
            <v-tab-item
                ><CustomerSubscriptionEdit
                    :userprofile="userprofile"
                    :subscription="subscription"
            /></v-tab-item>
        </v-tabs-items>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CustomerProfile from "./CustomerProfile.vue";
import CustomerEdit from "./CustomerEdit.vue";
import CustomerSubscriptionEdit from "./CustomerSubscriptionEdit.vue";
import { Prop } from "vue-property-decorator";
import {
    Userprofile,
    VendorSubscription,
} from "../../../../../server/src/interfaces";

@Component({
    components: {
        CustomerProfile,
        CustomerEdit,
        CustomerSubscriptionEdit,
    },
})
export default class CustomerProfileTabs extends Vue {
    @Prop() userprofile!: Userprofile;
    @Prop() loggedInUser!: string;
    @Prop() subscription!: VendorSubscription;
    private tab = 0;
}
</script>