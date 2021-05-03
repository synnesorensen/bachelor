<template>
	<v-container>
        <v-row>
            <v-col>
                <Subscribers @userSelected="userSelected" />
            </v-col>
            <v-col> 
		        <CustomerInvoice :selectedUser="selectedUser" />
            </v-col>
        </v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Subscribers from './Subscribers.vue'
import CustomerInvoice from './CustomerInvoice.vue'
import * as interfaces from "../../../../../server/src/interfaces";

@Component({
	components: {
		Subscribers,
        CustomerInvoice
	},
})

export default class AdminInvoicing extends Vue {
    private selectedUser: interfaces.UserSubscription | null = null;

    userSelected(user: interfaces.UserSubscription) {
        this.selectedUser = user;
    }


}
</script>
