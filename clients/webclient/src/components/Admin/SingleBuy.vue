<template>
  <v-container>
    <v-row>
      <v-col>
        <Customers @userSelected="userSelected" />
      </v-col>
      <v-col>
        <SinglePayment :selectedUser="selectedUser" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Customers from "./Customers.vue";
import SinglePayment from "./SinglePayment.vue";
import * as dto from "../../../../../common/dto";

@Component({
  components: {
    Customers,
    SinglePayment,
  },
})
export default class SingleBuy extends Vue {
  private selectedUser: dto.UserDto | null = null;

  userSelected(user: dto.UserDto) {
    this.selectedUser = user;
  }
}
</script>