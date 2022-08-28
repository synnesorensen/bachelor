<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="4">
        <v-img src="../assets/LPH.png" required />
      </v-col>
    </v-row>
    <v-form v-model="isFormValid">
      <v-row no-gutters>
        <v-col cols="8">
          <h2>Kunderegistrering</h2>
          <p class="font-weight-light mb-0">
            En forespørsel vil bli sendt til Lunsj på Hjul. Etter
            godkjenning, kan du opprette et abonnement eller kjøpe enkle
            lunsjleveringer.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col :xl="8" :lg="8">
          <v-row dense class="text-center">
            <v-col>
              <v-text-field
                :rules="[required]"
                label="Fornavn"
                outlined
                v-model="firstName"
                dense
                class="pa-0"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Etternavn"
                outlined
                v-model="lastName"
                :rules="[required]"
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense class="text-center">
            <v-col>
              <v-text-field
                label="Hjemmeadresse"
                outlined
                v-model="address"
                :rules="[required]"
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense class="text-center">
            <v-col cols="3">
              <v-text-field
                :rules="[numbers, postNoLength, required]"
                label="Postnummer"
                outlined
                v-model="postNo"
                dense
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Poststed hjemmeadresse"
                outlined
                v-model="postPlace"
                :rules="[required]"
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense class="text-center">
            <v-col>
              <v-text-field
                label="Leveringsadresse"
                v-model="deliveryAddress"
                :rules="[required]"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense class="text-center">
            <v-col cols="3">
              <v-text-field
                :rules="[numbers, postNoLength, required]"
                label="Postnummer"
                v-model="delPostNo"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Poststed leveringsadresse"
                v-model="delPostPlace"
                outlined
                :rules="[required]"
                dense
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense class="text-center">
            <v-col>
              <v-text-field
                :rules="[numbers, phoneNoLength, required]"
                label="Telefonnummer"
                v-model="phone"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="ma-0" dense>
        <p class="ma-0 font-weight-medium">Allergier:</p>
      </v-row>
      <v-row dense>
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="value"
            :items="allergies"
            solo
            chips
            label="Velg alle aktuelle"
            multiple
          ></v-select>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col :xl="6" :lg="6">
          <p class="font-weight-medium mb-0">
            Fyll ut ønsket startdato, og andre eventuelle merknader
          </p>
          <v-text-field
            label="Merknader"
            v-model="note"
            counter
            maxlength="80"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :xl="2" :lg="3">
          <v-tooltip :disabled="isFormValid" right>
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <v-btn @click="cancel" color="error" class="ma-2">
                  Avbryt
                </v-btn>
                <v-btn
                  @click="sendToDb"
                  color="success"
                  :disabled="!isFormValid"
                  class="ma-2"
                >
                  Send inn
                </v-btn>
              </div>
            </template>
            <span>Vennligst fyll ut alle påkrevde felt</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../api/api";
import { Vendor } from "../../../../common/interfaces";

@Component
export default class RegisterAccount extends Vue {
  private isFormValid = false;
  private vendor: Vendor | null = null;
  private firstName = "";
  private lastName = "";
  private address = "";
  private postNo = "";
  private postPlace = "";
  private deliveryAddress = "";
  private delPostNo = "";
  private delPostPlace = "";
  private phone = "";
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
  private value = [];
  private note = "";

  async sendToDb() {
    const approved: "new" | "approved" | "denied" = "new";
    const newUserprofile = {
      fullname: this.firstName + " " + this.lastName,
      address: this.address,
      deliveryAddress: this.deliveryAddress,
      phone: this.phone.toString(),
      email: this.$store.getters.loggedInUser,
      allergies: this.value,
      approved,
      isVendor: false,
      note: this.note,
    };

    await api.putUserprofile(newUserprofile);
    this.$store.commit("setUserprofile", newUserprofile);
    this.$router.push({ name: "info" });
  }

  cancel() {
    this.$router.push({ name: "welcome" });
  }

  // Rules:
  numbers(value: string) {
    return !isNaN(parseInt(value)) || "Vennligst oppgi kun siffer";
  }
  postNoLength(value: string) {
    return (
      value.length == 4 || "Vennligst oppgi et postnummer bestående av 4 siffer"
    );
  }
  phoneNoLength(value: string) {
    // TODO: Lage bedre nummer
    return value.length !== 0 || "Vennligst oppgi et gyldig telefonnummer";
  }
  required(value: string) {
    return !!value || "Dette feltet må fylles ut";
  }
}
</script>
