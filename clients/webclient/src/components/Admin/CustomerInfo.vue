<template>
  <div>
    <v-row dense>
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Navn</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">{{ selectedUser.fullname }}</p>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Adresse</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">{{ selectedUser.address }}</p>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Telefon</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">{{ selectedUser.phone }}</p>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Epost</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">{{ selectedUser.email }}</p>
      </v-col>
    </v-row>
    <v-row dense v-if="selectedUser.allergies">
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Allergier</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">
          {{ selectedUser.allergies }}
        </p>
      </v-col>
    </v-row>
    <v-row dense v-if="selectedUser.subscription">
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Box</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">
          {{ selectedUser.subscription.box }}
        </p>
      </v-col>
    </v-row>
    <v-row dense v-if="selectedUser.subscription">
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Antall</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">
          {{ selectedUser.subscription.noOfMeals }}
        </p>
      </v-col>
    </v-row>
    <v-row dense v-if="selectedUser.subscription">
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Status abonnement</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">
          {{ selectedUser.subscription.paused ? "Pauset" : "Aktiv" }}
        </p>
      </v-col>
    </v-row>
    <v-row dense >
      <v-col :xl="4" :lg="5">
        <p class="font-weight-medium">Status kundeforhold</p>
      </v-col>
      <v-col>
        <p class="font-weight-light">
          {{ userStatus() }}
        </p>
      </v-col>
    </v-row>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import * as dto from "../../../../../common/dto";

@Component({
  components: {},
})
export default class CustomerInfo extends Vue {
  @Prop() selectedUser!: dto.UserDto | null;

  userStatus() {
    switch (this.selectedUser?.approved) {
      case "new":
        return "Ubehandlet";
      case "approved":
        return "Godkjent";
      case "denied":
        return "Avvist";
    }
  }

}
</script>