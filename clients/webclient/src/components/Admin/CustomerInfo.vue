<template>
  <div>
    <v-form v-model="isFormValid">
      <v-card-text class="pl-0">
        <v-row dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Navn</p>
          </v-col>
          <v-col v-if="editMode" class="d-flex" cols="12" md="6">
            <v-text-field
              v-model="selectedUser.fullname"
              :rules="[required]"
              solo
            ></v-text-field>
          </v-col>
          <v-col v-else>
            <p class="font-weight-light">
              {{ selectedUser.fullname }}
            </p>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Bostedsadresse</p>
          </v-col>
          <v-col v-if="editMode" class="d-flex" cols="12" md="6">
            <v-text-field
              v-model="selectedUser.address"
              :rules="[required]"
              solo
            ></v-text-field>
          </v-col>
          <v-col v-else>
            <p class="font-weight-light">
              {{ selectedUser.address }}
            </p>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Leveringsadresse</p>
          </v-col>
          <v-col v-if="editMode" class="d-flex" cols="12" md="6">
            <v-text-field
              v-model="selectedUser.deliveryAddress"
              :rules="[required]"
              solo
            ></v-text-field>
          </v-col>
          <v-col v-else>
            <p class="font-weight-light">
              {{ selectedUser.deliveryAddress }}
            </p>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Telefonnummer</p>
          </v-col>
          <v-col v-if="editMode" class="d-flex" cols="12" md="6">
            <v-text-field
              v-model="selectedUser.phone"
              :rules="[numbers, phoneNoLength]"
              solo
            ></v-text-field>
          </v-col>
          <v-col v-else>
            <p class="font-weight-light">
              {{ selectedUser.phone }}
            </p>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Epost</p>
          </v-col>
          <v-col>
            <p class="font-weight-light">
              {{ selectedUser.email }}
            </p>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Allergier</p>
          </v-col>
          <v-col v-if="editMode" class="d-flex" cols="12" md="6">
            <v-select
              v-model="selectedAllergies"
              :items="allergies"
              solo
              chips
              label="Velg alle aktuelle"
              multiple
            ></v-select>
          </v-col>
          <v-col v-else>
            <p
              class="font-weight-light"
              v-for="allergy in selectedUser.allergies"
              :key="allergy"
            >
              {{ allergy }}
            </p>
          </v-col>
        </v-row>

        <v-row v-if="selectedUser.subscription" dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Boks</p>
          </v-col>
          <v-col v-if="editMode" class="d-flex" cols="12" md="6">
            <v-select
              v-model="selectedBox"
              :items="boxes"
              solo
              chips
              label="Velg boks"
              multiple
            ></v-select>
          </v-col>
          <v-col v-else>
            <p class="font-weight-light">
              {{ selectedUser.subscription.box === "Engangsboks" ? "Engangs" : "Gjenbruk" }}
            </p>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Notat</p>
          </v-col>
          <v-col>
            <p class="font-weight-light">
              {{ selectedUser.note }}
            </p>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col :xl="4">
            <p class="font-weight-medium">Status kundeforhold</p>
          </v-col>
          <v-col>
            <p class="font-weight-light">
              {{ userStatus() }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import * as dto from "../../../../../common/dto";

@Component({
  components: {},
})
export default class CustomerInfo extends Vue {
  @Prop() selectedUser!: dto.UserDto | null;
  @Prop() editProfile!: boolean;
  private allergies = [
    "Gluten",
    "Skalldyr",
    "Egg",
    "Fisk",
    "Peanøtter",
    "Nøtter",
    "Melk",
    "Soya",
    "Selleri",
    "Sennep",
    "Sesam",
    "Svovel",
    "Lupin",
    "Bløtdyr",
  ];
  private editMode = false;
  private isFormValid = false;
  private selectedAllergies: string[] = [];
  private selectedBox = "";
  private boxes = ["Gjenbruks", "Engangs"]

  @Watch("editProfile")
  editProfileChanged() {
    this.editMode = this.editProfile;
  }

  isUserApproved() {
    return this.selectedUser?.approved !== "denied";
  }

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

  // Rules
  numbers(value: string) {
    return !isNaN(parseInt(value)) || "Vennligst oppgi et gyldig nummer";
  }
  phoneNoLength(value: string) {
    return (
      value.length >= 8 || "Vennligst oppgi et gyldig telefonnummer (8 siffer)"
    );
  }
  required(value: string) {
    return value.length > 0 || "Dette feltet kan ikke stå tomt";
  }
}
</script>
