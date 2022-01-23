<template>
  <v-card>
    <v-app-bar dark color="success">
      <v-card-title>Leveranseforespørsler</v-card-title>
    </v-app-bar>
    <br />
    <v-list dense>
      <v-list-item-group v-model="selectedRequest" color="primary">
        <v-list-item v-for="(sub, i) in requests" v-bind:key="i">
          <v-list-item-content>
            <v-list-item-title v-text="sub.userId"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../../api/api";
import * as dto from "../../../../../common/dto";
import { Delivery } from "../../../../../common/interfaces";

@Component({
  components: {},
})

export default class SingleBuy extends Vue {
  private requests: Delivery[] | null = [];
    private _selectedRequest = 0;

  async mounted() {
    this.requests = await api.getDeliveryRequests()
  }

  get selectedRequest() {
    return this._selectedRequest;
  }

  set selectedRequest(value) {
    this._selectedRequest = value;
  }

}
</script>