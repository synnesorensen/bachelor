<template>
    <v-card>
        <v-card-title>Kundeliste</v-card-title>
        <v-list dense>
            <v-list-item-group
            v-model="selectedSub"
            color="primary"
        >
            <v-list-item
            v-for="(sub, i) in subscribers"
            v-bind:key="i"
            >
            <v-list-item-content>
                <v-list-item-title v-text="sub.fullname"></v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
        </v-list>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as interfaces from "../../../../../server/src/interfaces";
import { getVendorSubscriptions } from '../../api/api'

@Component
export default class Subscribers extends Vue {
    private _selectedSub = 0;
    private subscribers: interfaces.UserSubscription[] = [];
    
    async created() {
        this.subscribers = await getVendorSubscriptions();
    }

    get selectedSub() {
        return this._selectedSub;
    }
    set selectedSub(value) {
        this._selectedSub = value;
        if (this._selectedSub != undefined) {
            this.$emit("userSelected", this.subscribers[this._selectedSub]);
        }
        
    }
}
</script>