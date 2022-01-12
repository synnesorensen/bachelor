<template>
	<v-container>
        <v-row>
            <v-col>
                <Subscribers @userSelected="userSelected" />
            </v-col>
            <v-col> 
		        <SubscriptionPayment :selectedUser="selectedUser" />
            </v-col>
        </v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Subscribers from './Subscribers.vue'
import SubscriptionPayment from './SubscriptionPayment.vue'
import * as dto from "../../../../../common/dto";

@Component({
	components: {
		Subscribers,
        SubscriptionPayment
	},
})
export default class Subscriptions extends Vue {
    private selectedUser: dto.UserDto | null = null;

    userSelected(user: dto.UserDto) {
        this.selectedUser = user;
    }
}
</script>