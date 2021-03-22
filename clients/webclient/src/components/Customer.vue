<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Vælkommin te Lønsj på hjul!
        </h1>
        <h2> Innmari godt lizm! From all over the {{hallai}}
        </h2>
        <p>Customers: {{customers}} </p>
        <br>
        <v-btn color="primary" @click="runLambda()">Press me</v-btn>
        <v-btn color="primary" @click="runCustomers()">Get customers</v-btn>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {getCustomers} from '../api/getCustomers'

@Component
export default class Customer extends Vue {
  private hallai = "Norway";
  private customers = "No customers";

  async runCustomers() {
    let i = await getCustomers();
    console.log(i);
    this.customers = JSON.stringify(i);
  }
}

</script>
