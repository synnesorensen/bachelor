<template>
  <v-card>
    <v-app-bar dark color="success">
      <v-card-title>Kunder</v-card-title>
    </v-app-bar>
    <br />
    <v-list dense>
      <v-list-item-group v-model="selectedCustomer" color="primary">
        <v-list-item v-for="(user, i) in approvedCustomers" v-bind:key="i">
          <v-list-item-content>
            <v-list-item-title v-text="user.fullname"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as dto from "../../../../../common/dto";
import api from "../../api/api";

@Component
export default class Customers extends Vue {
  private _selectedCustomer = 0;
  private approvedCustomers: dto.UserDto[] = [];

  async created() {
    const customers = await api.getUsersAndSubscriptions();
    this.approvedCustomers = customers.filter((customer) => customer.approved);
  }

  get selectedCustomer() {
    return this._selectedCustomer;
  }
  set selectedCustomer(value) {
    this._selectedCustomer = value;
    if (this._selectedCustomer != undefined) {
      this.$emit(
        "userSelected",
        this.approvedCustomers[this._selectedCustomer]
      );
    }
  }
}
</script>