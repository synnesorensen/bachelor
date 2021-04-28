<template>
	<v-container>
		<v-row>
			<v-col>
                <div v-for="sub in allSubscriptions" v-bind:key="sub.userId">
                    <p class="font-weight-light"> {{sub.fullname}} </p>
                </div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as interfaces from "../../../../../server/src/interfaces";
import { getVendorSubscriptions } from "../../api/api";

@Component
export default class AdminInvoicing extends Vue {
    private allSubscriptions: interfaces.UserSubscription[] | null = null;

    async created() {
        const result = await getVendorSubscriptions();
        console.log(result)
        if (result != null) {
            this.allSubscriptions = result;
        }
    }


}
</script>
