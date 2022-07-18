<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-app-bar dark color="#79b321">
            <v-card-title> Opplysninger </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="editProfile">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-app-bar>
          <v-form v-model="isFormValid">
            <v-card-text>
              <br />
              <v-row>
                <v-col :xl="3" :lg="3" :md="3" :sm="2">
                  <p class="font-weight-medium">Navn</p>
                </v-col>
                <v-col v-if="editMode" class="d-flex" cols="12" md="6">
                  <v-text-field
                    v-model="$store.getters.vendor.fullname"
                    :rules="[required]"
                    solo
                  ></v-text-field>
                </v-col>
                <v-col v-else>
                  <p class="font-weight-light">
                    {{ $store.getters.vendor.fullname }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="3" :lg="3" :md="3" :sm="2">
                  <p class="font-weight-medium">Firmanavn</p>
                </v-col>
                <v-col v-if="editMode" class="d-flex" cols="12" md="6">
                  <v-text-field
                    v-model="$store.getters.vendor.company"
                    :rules="[required]"
                    solo
                  ></v-text-field>
                </v-col>
                <v-col v-else>
                  <p class="font-weight-light">
                    {{ $store.getters.vendor.company }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="3" :lg="3" :md="3" :sm="2">
                  <p class="font-weight-medium">Adresse</p>
                </v-col>
                <v-col v-if="editMode" class="d-flex" cols="12" md="6">
                  <v-text-field
                    v-model="$store.getters.vendor.address"
                    :rules="[required]"
                    solo
                  ></v-text-field>
                </v-col>
                <v-col v-else>
                  <p class="font-weight-light">
                    {{ $store.getters.vendor.address }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="3" :lg="3" :md="3" :sm="2">
                  <p class="font-weight-medium">Telefonnummer</p>
                </v-col>
                <v-col v-if="editMode" class="d-flex" cols="12" md="6">
                  <v-text-field
                    v-model="$store.getters.vendor.phone"
                    :rules="[required, phoneNoLength, numbers]"
                    solo
                    lazy
                  ></v-text-field>
                </v-col>
                <v-col v-else>
                  <p class="font-weight-light">
                    {{ $store.getters.vendor.phone }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="3" :lg="3" :md="3" :sm="2">
                  <p class="font-weight-medium">E-post</p>
                </v-col>
                <v-col>
                  <p class="font-weight-light">
                    {{ $store.getters.vendor.email }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="3" :lg="3" :md="3" :sm="2">
                  <p class="font-weight-medium">Leveringsplan</p>
                </v-col>
                <v-col>
                  <div v-for="item in items" v-bind:key="item.id">
                    <p class="font-weight-light">
                      {{ item.day + "  -  " + item.menu }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions v-if="editMode">
              <v-spacer></v-spacer>
              <v-col>
                <v-btn @click="cancelEditProfile" color="error" class="ma-1">
                  Avbryt
                </v-btn>
                <v-btn
                  :disabled="!isFormValid"
                  @click="updateUserProfile"
                  color="success"
                  class="ma-1"
                >
                  Lagre
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../../api/api";
import * as interfaces from "../../../../../common/interfaces";
import { toLocalPresentation } from "@/utils/utils";

@Component
export default class CustomerProfile extends Vue {
  private items: interfaces.MenuItems[] | null = [];
  private isFormValid = false;
  private editMode = false;

  async mounted() {
    this.items = this.$store.getters.vendor.schedule;
  }

  editProfile() {
    this.editMode = true;
  }

  async updateUserProfile() {
    let updated = this.$store.getters.vendor;
    let loggedInVendor = this.$store.getters.loggedInUser;
    await api.putVendor(updated, loggedInVendor);
    this.editMode = false;
  }

  async cancelEditProfile() {
    let unchangedUserprofile = await api.getVendor();
    if (unchangedUserprofile) {
      this.$store.getters.userprofile.fullname = unchangedUserprofile.fullname;
      this.$store.getters.userprofile.company = unchangedUserprofile.company;
      this.$store.getters.userprofile.address = unchangedUserprofile.address;
      this.$store.getters.userprofile.phone = unchangedUserprofile.phone;
    }
    this.editMode = false;
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
  hasValue() {
    return this.items == undefined || null;
  }
  required(value: string) {
    return value.length > 0 || "Dette feltet kan ikke stå tomt";
  }

  localPresentation(time: string) {
    return toLocalPresentation(time);
  }
}
</script>