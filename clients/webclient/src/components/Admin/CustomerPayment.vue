<template>
    <v-card>
        <v-card-title>{{selectedUser}}</v-card-title>

    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import * as interfaces from "../../../../../server/src/interfaces";
import { getVendorSubscriptions } from '../../api/api'

@Component
export default class CustomerPayment extends Vue {
    @Prop() selectedUser:string = ""; 

    private subscriber = {
        userId: "test"
    }
    
}
</script>