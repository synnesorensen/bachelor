<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-app-bar dark color="#79b321">
            <v-card-title> Kundeprofil </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="editProfile">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-app-bar>
          <v-form v-model="isFormValid">
            <v-card-text>
              <v-row class="mt-2">
                <v-col :xl="4">
                  <p class="font-weight-medium">Navn</p>
                </v-col>
                <v-col v-if="editModeProfile" class="d-flex" cols="12" md="6">
                  <v-text-field
                    v-model="$store.getters.userprofile.fullname"
                    :rules="[required]"
                    solo
                  ></v-text-field>
                </v-col>
                <v-col v-else>
                  <p class="font-weight-light">
                    {{ $store.getters.userprofile.fullname }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="4">
                  <p class="font-weight-medium">Bostedsadresse</p>
                </v-col>
                <v-col v-if="editModeProfile" class="d-flex" cols="12" md="6">
                  <v-text-field
                    v-model="$store.getters.userprofile.address"
                    :rules="[required]"
                    solo
                  ></v-text-field>
                </v-col>
                <v-col v-else>
                  <p class="font-weight-light">
                    {{ $store.getters.userprofile.address }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="4">
                  <p class="font-weight-medium">Leveringsadresse</p>
                </v-col>
                <v-col>
                  <p class="font-weight-light">
                    {{ $store.getters.userprofile.deliveryAddress }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="4">
                  <p class="font-weight-medium">Telefonnummer</p>
                </v-col>
                <v-col v-if="editModeProfile" class="d-flex" cols="12" md="6">
                  <v-text-field
                    v-model="$store.getters.userprofile.phone"
                    :rules="[numbers, phoneNoLength]"
                    solo
                  ></v-text-field>
                </v-col>
                <v-col v-else>
                  <p class="font-weight-light">
                    {{ $store.getters.userprofile.phone }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="4">
                  <p class="font-weight-medium">Epost</p>
                </v-col>
                <v-col>
                  <p class="font-weight-light">
                    {{ $store.getters.userprofile.email }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="4">
                  <p class="font-weight-medium">Allergier</p>
                </v-col>
                <v-col v-if="editModeProfile" class="d-flex" cols="12" md="6">
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
                    v-for="allergy in $store.getters.userprofile.allergies"
                    :key="allergy"
                    id="allergylist"
                  >
                    {{ allergy }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col :xl="4">
                  <p class="font-weight-medium">Status</p>
                </v-col>
                <v-col>
                  <p class="font-weight-light">{{ status }}</p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions v-if="editModeProfile">
              <v-col>
                <v-btn text color="orange" @click="deleteDialog = true">
                  Slett meg
                </v-btn>
                <v-dialog v-model="deleteDialog" persistent max-width="500">
                  <v-card>
                    <v-card-title class="headline"
                      >Sletting av registrerte opplysninger</v-card-title
                    >
                    <v-card-text>
                      Er du sikker på at du vil slette alle dine registrerte
                      opplysninger?<br />
                      Dette vil også slette eventuelle utestående leveranser du
                      har til gode. Det er derfor anbefalt å vente med å slette
                      personopplysninger til du har mottatt alle leveranser du
                      har betalt for.
                    </v-card-text>
                    <v-card-actions>
                      <v-item-group>
                        <v-btn color="grey" @click="deleteDialog = false">
                          Avbryt
                        </v-btn>
                        <v-btn color="orange" @click="deleteMe()">
                          Slett meg
                        </v-btn>
                      </v-item-group>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="1"></v-col>
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
      <v-col>
        <v-card v-if="$store.getters.userprofile.approved !== 'denied'">
          <v-app-bar dark color="#79b321">
            <v-card-title> Abonnement </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="editSub">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text
            v-if="
              $store.getters.subscription &&
              this.$store.getters.userprofile.approved !== 'new'
            "
          >
            <v-row class="mt-2">
              <v-col>
                <p class="font-weight-medium">Antall porsjoner</p>
              </v-col>
              <v-col v-if="editModeSub" class="d-flex" cols="12" sm="6">
                <v-select
                  v-model="selectedNoOfMeals"
                  :items="noOfMeals"
                  solo
                  label="Velg antall porsjoner"
                ></v-select>
              </v-col>
              <v-col v-else>
                <p class="font-weight-regular">
                  {{ $store.getters.subscription.noOfMeals }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="font-weight-medium">Valgt boks</p>
              </v-col>
              <v-col v-if="editModeSub" class="d-flex" cols="12" sm="6">
                <v-select
                  v-model="selectedBox"
                  :items="boxes"
                  solo
                  label="Velg leveringsboks"
                ></v-select>
              </v-col>
              <v-col v-else>
                <p class="font-weight-regular">
                  {{ $store.getters.subscription.box }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="font-weight-medium">Valgte leveringer</p>
              </v-col>
              <v-col v-if="editModeSub" class="d-flex" cols="12" sm="6">
                <v-list flat>
                  <v-list-item-group multiple>
                    <v-list-item
                      v-for="item in items"
                      :key="item.id"
                      class="pl-0"
                    >
                      <v-list-item-action>
                        <v-checkbox
                          :value="item"
                          :key="item.id"
                          v-model="selectedSchedule"
                          dense
                          required
                        ></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title
                          >{{ item.day }}: {{ item.menu }}</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col v-else>
                <p
                  class="font-weight-regular"
                  v-for="item in $store.getters.subscription.schedule"
                  v-bind:key="item.id"
                >
                  {{ item.day + ": " + item.menu }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="font-weight-medium">
                  Betalt til og med: 
                </p>
              </v-col>
              <v-col v-if="$store.getters.subscription">
                <p class="font-weight-regular">{{ lastDelivery }}</p>
              </v-col>
              <v-col v-else>
                <p class="font-weight-regular">
                  Det er ikke registrert betaling for leveranser i denne
                  perioden.
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="font-weight-medium">
                  Neste faktura må betales innen:
                </p>
              </v-col>
              <v-col v-if="$store.getters.subscription">
                <p class="font-weight-regular">{{ nextInvoice }}</p>
              </v-col>
              <v-col v-else>
                <p class="font-weight-regular">
                  Du vil få tilsendt faktura for neste periode så snart
                  abonnementet ditt er blitt godkjent.
                </p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text
            v-if="
              $store.getters.subscription &&
              this.$store.getters.userprofile.approved === 'new'
            "
          >
            <v-row>
              <v-col>
                <p class="font-weight-medium">
                  Venter på godkjenning av adresse
                </p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions v-if="editModeSub">
            <v-spacer></v-spacer>
            <v-btn @click="cancelEditSub" color="error"> Avbryt </v-btn>
            <v-btn @click="updateSubscription" color="success"> Lagre </v-btn>
          </v-card-actions>
          <v-card-actions
            v-if="
              $store.getters.subscription &&
              this.$store.getters.userprofile.approved === 'approved'
            "
          >
            <v-col>
              <v-btn @click="dialog = true" text color="orange">
                {{ this.buttonText }}
              </v-btn>
            </v-col>
            <v-dialog v-model="dialog" persistent max-width="400">
              <v-card>
                <v-container>
                  <v-card-title class="headline">
                    {{ this.buttonText }}
                  </v-card-title>
                  <v-card-text> {{ this.dialogText }} </v-card-text>
                  <v-row class="pa-4" align="center" justify="center">
                    <v-btn color="error" @click="dialog = false" class="ma-2">
                      Avbryt
                    </v-btn>
                    <v-btn
                      color="success"
                      @click="toggleSubscriptionPause()"
                      class="ma-2"
                    >
                      {{
                        $store.getters.subscription.paused
                          ? "Aktiver"
                          : "Sett på pause"
                      }}
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
          </v-card-actions>
          <v-card-text v-if="!$store.getters.subscription">
            <p v-if="!goToReg" class="font-weight-regular mt-2">
              Du har ikke tegnet et abonnement. Dersom du ønsker faste
              leveringer en eller flere dager i uken, kan du sette opp et
              abonnement ved å trykke på knappen.
            </p>
          </v-card-text>
          <v-card-actions v-if="!$store.getters.subscription && !goToReg">
            <v-btn @click="goToReg = true" text color="orange"
              >Registrer et abonnement</v-btn
            >
          </v-card-actions>
          <v-form class="ml-8" v-if="goToReg" v-model="isFormValid">
            <v-row>
              <p class="ma-0 font-weight-medium">Velg antall porsjoner:</p>
            </v-row>
            <v-row>
              <v-col class="pl-0" cols="auto">
                <v-select
                  v-model="selectedNoOfMeals"
                  :items="noOfMeals"
                  solo
                  :rules="[(v) => !!v || 'Item is required']"
                  required
                  label="Antall porsjoner"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <p class="ma-0 font-weight-medium">Velg type leveringsboks:</p>
            </v-row>
            <v-row>
              <v-col class="pl-0" cols="auto">
                <v-select
                  v-model="selectedBox"
                  :items="boxes"
                  solo
                  :rules="[(v) => !!v || 'Item is required']"
                  required
                  label="Type boks"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <p class="ma-0 font-weight-medium">Velg leveringsdag(er):</p>
            </v-row>
            <v-row>
              <v-col class="pl-0" cols="auto">
                <v-list flat>
                  <v-list-item-group multiple>
                    <v-list-item
                      v-for="item in items"
                      :key="item.id"
                      class="pl-0"
                    >
                      <v-list-item-action>
                        <v-checkbox
                          :value="item"
                          :key="item.id"
                          v-model="selectedSchedule"
                          dense
                          required
                        ></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title
                          >{{ item.day }}: {{ item.menu }}</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
            <v-row>
              <v-btn @click="cancelReg" color="error" class="ma-2">
                Avbryt
              </v-btn>
              <v-btn
                @click="makeSub"
                :disabled="!isFormValid || hasValue()"
                color="success"
                class="ma-2"
              >
                Send inn
              </v-btn>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { toLocalPresentation } from "@/utils/utils";
import Vue from "vue";
import Component from "vue-class-component";
import { Route } from "vue-router";
import {
  SubscriptionAction,
  MenuItems,
  Subscription,
  Vendor,
  UserStatus,
} from "../../../../../common/interfaces";
import DatePicker from "../DatePicker.vue";
import api from "../../api/api";

@Component({
  components: {
    DatePicker,
  },
})
export default class CustomerProfile extends Vue {
  private status = "";

  get lastDelivery() {
    if (this.$store.getters.subscription?.paused == true) {
      return "Abonnementet ditt er satt på pause. Du vil ikke få leveranser før abonnementet startes igjen.";
    }
    return this.lastPaid
      ? this.lastPaid
      : "Du har ingen leveranser denne perioden.";
  }

  get lastPaid() {
    if (this.$store.getters.subscription?.lastDeliveryDate) {
      return this.localPresentation(
        this.$store.getters.subscription.lastDeliveryDate
      );
    }
    return "";
  }

  get nextInvoice() {
    if (this.$store.getters.subscription) {
      if (this.$store.getters.subscription.paused == true) {
        return "Abonnementet ditt er satt på pause. Du vil ikke få ny faktura før abonnementet startes igjen.";
      }
      if (this.lastPaid) {
        let dateForLastDelivery = new Date(this.lastPaid);
        dateForLastDelivery.setMonth(dateForLastDelivery.getMonth() + 1, 1);
        let nextInvoiceDate = new Date(dateForLastDelivery);
        return this.localPresentation(
          nextInvoiceDate.toISOString().substr(0, 10)
        );
      }
      return "Innen utgangen av denne måneden.";
    }
    return "";
  }

  localPresentation(time: string) {
    return toLocalPresentation(time);
  }

  private isFormValid = false;
  private dialog = false;
  private editModeProfile = false;
  private editModeSub = false;
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
  private selectedAllergies: string[] = [];
  private noOfMeals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private selectedNoOfMeals = 1;
  private boxes = ["Engangsbokser", "Gjenbruksbokser (kr 218 for to stk)"];
  private selectedBox = "";
  private vendor: Vendor | null = null;
  private selectedSchedule: MenuItems[] = [];
  private goToReg = false;
  private deleteDialog = false;
  private items: any[] = [];
  private updateTxt = "";

  userStatus(): string {
    switch (this.$store.getters.userprofile.approved) {
      case "new":
        return "Venter på godkjenning fra Lunsj på Hjul";
      case "approved":
        return "Godkjent";
      case "denied":
        return "Lunsj på Hjul kan dessverre ikke levere til deg";
      default:
        return "En feil oppstod";
    }
  }

  async mounted() {
    this.status = this.userStatus();
    this.selectedAllergies = this.$store.getters.userprofile.allergies;
    if (this.$store.getters.subscription) {
      this.selectedNoOfMeals = this.$store.getters.subscription.noOfMeals;
      this.selectedBox = this.$store.getters.subscription.box;
      this.selectedSchedule = this.$store.getters.subscription.schedule;
    }
    this.items = this.$store.getters.vendor.schedule;
  }

  async toggleSubscriptionPause() {
    this.dialog = false;
    if (!this.$store.getters.subscription) {
      alert("Du har ikke noe abonnement...");
    } else {
      let time = new Date(Date.now());
      if (time.getHours() < 10) {
        time.setDate(time.getDate() + 1);
      } else {
        time.setDate(time.getDate() + 2);
      }

      let action: SubscriptionAction = {
        time: time.toISOString().substr(0, 10),
        action: this.$store.getters.subscription.paused ? "unpause" : "pause",
      };
      this.updateTxt = "Oppdaterer...";
      const updatedSub = await api.postSubscription(this.$store.getters.vendor.vendorId, action);
      this.$store.commit("setSubscription", updatedSub);
      this.updateTxt = "";
    }
  }

  get buttonText() {
    if (this.updateTxt !== "") {
      return this.updateTxt;
    }
    if (this.$store.getters.subscription?.paused) {
      return "Aktiver abonnement";
    }
    return "Pause abonnement";
  }

  get dialogText() {
    if (this.$store.getters.subscription?.paused) {
      return "Du aktiverer nå ditt abonnement igjen. \
    Sjekk din kalender for å se når leveranser du eventuelt har til gode \
    vil bli levert. ";
    }
    return "Ved å sette ditt abonnement på pause vil dine kommende leveranser bli avbestilt.\
  Disse vil du få tilbake når du starter opp igjen abonnementet ditt. \
  Hvis du setter abonnementet ditt på pause etter klokken 10:00 dagen før du har en levering, \
  vil denne leveransen fortsatt bli levert. \
  Sjekk din kalender for å se når din siste levering er.";
  }

  editProfile() {
    this.editModeProfile = true;
  }

  editSub() {
    this.editModeSub = true;
  }

  async updateUserProfile() {
    let updated = this.$store.getters.userprofile;
    this.$store.getters.userprofile.allergies = this.selectedAllergies;
    await api.putUserprofile(updated);
    this.editModeProfile = false;
  }

  async cancelEditProfile() {
    let unchangedUserprofile = await api.getUserprofile();
    if (unchangedUserprofile) {
      this.$store.getters.userprofile.fullname = unchangedUserprofile.fullname;
      this.$store.getters.userprofile.address = unchangedUserprofile.address;
      this.$store.getters.userprofile.phone = unchangedUserprofile.phone;
      this.$store.getters.userprofile.email = unchangedUserprofile.email;
      this.$store.getters.userprofile.allergies =
        unchangedUserprofile.allergies;
    }
    this.editModeProfile = false;
    this.selectedAllergies = [];
  }

  async updateSubscription() {
    let result: string[] = this.selectedSchedule.map((item) => {
      return item.id;
    });
    let sub: Subscription = {
      vendorId: this.$store.getters.subscription.vendorId,
      userId: this.$store.getters.userprofile.email,
      paused: false,
      schedule: result,
      noOfMeals: this.selectedNoOfMeals,
      box: this.selectedBox,
    };
    await api.putUserSubscription(sub);
    let updated = await api.getSubscription();
    this.$store.commit("setSubscription", updated);
    this.editModeSub = false;
  }

  async cancelEditSub() {
    let unchangedSub = await api.getSubscription();
    if (unchangedSub) {
      this.$store.getters.subscription.selectedNoOfMeals =
        unchangedSub.noOfMeals;
      this.$store.getters.subscription.selectedDeliveryDays =
        unchangedSub.schedule;
      this.$store.getters.subscription.selectedBox = unchangedSub.box;
    }
    this.editModeSub = false;
  }

  async makeSub() {
    let result: string[] = this.selectedSchedule.map((item) => {
      return item.id;
    });
    let sub: Subscription = {
      vendorId: this.$store.getters.vendor.vendorId,
      userId: this.$store.getters.userprofile.email,
      paused: false,
      schedule: result,
      noOfMeals: this.selectedNoOfMeals,
      box: this.selectedBox,
    };
    await api.putUserSubscription(sub);
    let updated = await api.getSubscription();
    this.$store.commit("setSubscription", updated);
    this.goToReg = false;
  }

  cancelReg() {
    this.$store.commit("setSubscription", null);
    this.goToReg = false;
  }

  async deleteMe() {
    try {
      let subscription = await api.getSubscription();
      if (subscription && this.vendor) {
        await api.deleteUserSubscription(this.vendor.vendorId);
      }
      await api.deleteUserprofile();
      this.deleteDialog = false;
      this.editModeProfile = false;
      this.$store.commit("setUserprofile", null);
      this.$store.commit("setSubscription", null);
      this.$store.dispatch("logout");
    } catch (err) {
      alert("Noe gikk galt ved sletting: " + err);
    }
  }

  beforeRouteLeave(to: Route, from: Route, next: Function) {
    if (this.editModeProfile || this.editModeSub) {
      const answer = window.confirm(
        "Du har ulagrede endringer på siden. Ønsker du å forlate siden uten å lagre disse endringene?"
      );
      if (answer) {
        if (this.editModeProfile) {
          this.cancelEditProfile();
        } else {
          this.cancelEditSub();
        }
        next();
      } else {
        next(false);
      }
    } else {
      next();
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
  hasValue() {
    return this.selectedSchedule == undefined || null;
  }
  required(value: string) {
    return value.length > 0 || "Dette feltet kan ikke stå tomt";
  }
}
</script>