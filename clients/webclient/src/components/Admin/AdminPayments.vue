<template>
	<v-container>
        <v-row>
            <v-col>
                <Subscribers @userSelected="userSelected" />
            </v-col>
            <v-col> 
		        <CustomerPayment :selectedUser="selectedUser" />
            </v-col>
        </v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Subscribers from './Subscribers.vue'
import CustomerPayment from './CustomerPayment.vue'
import * as interfaces from "../../../../../server/src/interfaces";

@Component({
	components: {
		Subscribers,
        CustomerPayment
	},
})
export default class AdminPayments extends Vue {
    private selectedUser: interfaces.UserSubscription | null = null;

    userSelected(user: interfaces.UserSubscription) {
        this.selectedUser = user;
    }

}
</script>