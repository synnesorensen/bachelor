<template>
    <v-container>
        <Subscribers />
    </v-container>
    
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Subscribers from './Subscribers.vue'
import * as interfaces from "../../../../../server/src/interfaces";

@Component({
	components: {
		Subscribers
	},
})
export default class AdminPayments extends Vue {

}
</script>