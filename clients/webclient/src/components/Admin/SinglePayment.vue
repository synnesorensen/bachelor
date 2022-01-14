<template>
  <v-card>
    <v-app-bar dark color="success">
      <v-card-title>Valgt kunde</v-card-title>
    </v-app-bar>
    <br />
    <v-card-text v-if="!selectedUser">
      <v-row>
        <v-col>
          <p class="font-weight-medium">
            Velg en kunde fra listen til venstre.
          </p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="selectedUser">
      <CustomerInfo :selectedUser="selectedUser" />
      <v-row dense>
        <v-col :xl="4" :lg="5">
          <p class="font-weight-medium">Bestillinger til godkjenning</p>
        </v-col>
        <v-col>
          <p class="font-weight-light">{{}}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import * as dto from "../../../../../common/dto";
import DatePicker from "./DatePicker.vue";
import CustomerInfo from "./CustomerInfo.vue";

@Component({
  components: {
    DatePicker,
    CustomerInfo,
  },
})
export default class SinglePayment extends Vue {
  private loading = false;
  @Prop() selectedUser!: dto.UserDto | null;
  private paymentDialog = false;
  private datePickDialog = false;

  @Watch("selectedUser")
  async onChange() {
    if (this.selectedUser != null) {
      // oppdater godkjente bestillinger og betalinger og sånn
    }
  }
}
</script>