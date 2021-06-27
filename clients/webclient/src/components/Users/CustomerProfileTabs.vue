<template>
    <v-container>
        <v-tabs v-model="tab">
            <v-tab>Min Profil</v-tab>
            <v-tab>Endre min profil</v-tab>
            <v-tab>Endre mitt abonnement</v-tab>
        </v-tabs>
        <v-spacer />
        <v-tabs-items v-model="tab">
            <v-tab-item><CustomerProfile/></v-tab-item>
            <v-tab-item><CustomerEdit /></v-tab-item>
            <v-tab-item><CustomerSubscriptionEdit/></v-tab-item>
        </v-tabs-items>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CustomerProfile from "./CustomerProfile.vue";
import CustomerEdit from "./CustomerEdit.vue";
import CustomerSubscriptionEdit from "./CustomerSubscriptionEdit.vue";

@Component({
    components: {
        CustomerProfile,
        CustomerEdit,
        CustomerSubscriptionEdit,
    },
})
export default class CustomerProfileTabs extends Vue {
    private tab = 0;
}
</script>