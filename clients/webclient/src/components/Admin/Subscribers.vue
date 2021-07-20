<template>
    <v-card>
        <v-app-bar
            dark
            color="#79b321"
        >
            <v-card-title>Kundeliste</v-card-title>
        </v-app-bar>
        <br />
        <v-list dense>
            <v-list-item-group
            v-model="selectedSub"
            color="primary"
        >
            <v-list-item
            v-for="(sub, i) in approvedSubscribers"
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
import api from '../../api/api'

@Component
export default class Subscribers extends Vue {
    private _selectedSub = 0;
    private approvedSubscribers: interfaces.UserSubscription[] = [];
    
    async created() {
        let subscribers = await api.getVendorSubscriptions();
        this.approvedSubscribers = subscribers.filter(sub => sub.approved);
    }

    get selectedSub() {
        return this._selectedSub;
    }
    set selectedSub(value) {
        this._selectedSub = value;
        if (this._selectedSub != undefined) {
            this.$emit("userSelected", this.approvedSubscribers[this._selectedSub]);
        }
    }
}
</script>