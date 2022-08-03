<template>
  <v-container fluid>
    <v-row justify="center" dense class="mt-8">
      <v-col :xl="9" :lg="9" :md="10" :sm="12" :xs="12">
        <v-row>
          <v-col cols="12" class="pa-0">
            <v-card>
              <v-img
                src="../assets/gul-logo.png"
                required
                :height="imageHeight()"
              >
                <v-col>
                  <v-row>
                    <v-col cols="12">
                      <v-row class="ml-4 d-none d-sm-flex">
                        <v-spacer></v-spacer>
                        <v-item-group class="ma-6">
                          <v-btn
                            @click="showRegisterBox = true"
                            text
                            color="amber"
                            >Registrer</v-btn
                          >
                          <v-btn dark @click="showLogInBox = true" color="amber"
                            >Logg inn</v-btn
                          >
                        </v-item-group>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-img>
              <v-row no-gutters class="d-flex d-sm-none mt-2">
                <v-col>
                  <p :class="{ caption: $vuetify.breakpoint.smAndDown }">
                    GRAUTATYSDAG: Kjøleskapsgraut eller smoothiebowl-ish med skikkelig digg og fruktig toppings
                  </p>
                </v-col>
              </v-row>
              <v-row no-gutters class="d-flex d-sm-none">
                <v-col>
                  <p :class="{ caption: $vuetify.breakpoint.smAndDown }">
                    ONSDAGSSALATEN: Digg og mettande salat eller hummus-ish med grønnsaker; med
                  andre ord meir den originale Lunsj på hjul varianten
                  </p>
                </v-col>
              </v-row>
              <v-row no-gutters class="d-flex d-sm-none">
                <v-col>
                  <p :class="{ caption: $vuetify.breakpoint.smAndDown }">
                    [PÅKEBÅOL] TORSDAG:  Min vri på pokébowl, anten med superfersk fisk eller heilt
                  vegetarisk; kan nytast til lunsj eller sparast til middag
                  </p>
                </v-col>
              </v-row>
              <v-row class="d-flex d-sm-none justify-end ma-0 pr-6">
                <v-col cols="3">
                  <!-- MOBILE -->
                  <v-item-group>
                    <v-btn
                      x-small
                      @click="showRegisterBox = true"
                      text
                      color="amber"
                      >Registrer</v-btn
                    >
                    <v-btn
                      dark
                      x-small
                      @click="showLogInBox = true"
                      color="amber"
                      >Logg inn</v-btn
                    >
                  </v-item-group>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="my-4 d-none d-sm-flex">
          <v-col cols="4" class="pa-1">
            <v-card height="150">
              <v-card-title
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
                style="padding: 0"
              >
                <v-spacer></v-spacer>
                <p class="my-2">GRAUTATYSDAG</p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text
                :class="{
                  caption: $vuetify.breakpoint.mdAndDown,
                  'body-2': $vuetify.breakpoint.lgAndUp,
                }"
              >
                <p>
                  Kjøleskapsgraut eller smoothiebowl-ish med skikkelig digg og fruktig toppings
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="4" class="pa-1">
            <v-card height="150">
              <v-card-title
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
                style="padding: 0"
              >
                <v-spacer></v-spacer>
                <p class="my-2">ONSDAGSSALATEN</p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text
                :class="{
                  caption: $vuetify.breakpoint.mdAndDown,
                  'body-2': $vuetify.breakpoint.lgAndUp,
                }"
              >
                <p>
                  Digg og mettande salat eller hummus-ish med grønnsaker; med
                  andre ord meir den originale Lunsj på hjul varianten
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="4" class="pa-1">
            <v-card height="150">
              <v-card-title
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
                style="padding: 0"
              >
                <v-spacer></v-spacer>
                <p class="my-2">[PÅKEBÅOL] TORSDAG</p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text
                :class="{
                  caption: $vuetify.breakpoint.mdAndDown,
                  'body-2': $vuetify.breakpoint.lgAndUp,
                }"
              >
                <p>
                  Min vri på pokébowl, anten med superfersk fisk eller heilt
                  vegetarisk; kan nytast til lunsj eller sparast til middag
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" class="d-none d-sm-flex">
          <p class="ma-0" v-if="!showFaq">Vis FAQ</p>
          <p class="ma-0" v-else>Lukk FAQ</p>
        </v-row>
        <v-row align="center" justify="center" class="ma-0 d-none d-sm-flex">
          <v-icon v-if="!showFaq" x-large @click="atChevronClick" class="icon">
            {{ mdiChevronDown }}
          </v-icon>
          <v-icon v-else x-large @click="atChevronClick" class="icon">
            {{ mdiChevronUp }}
          </v-icon>
        </v-row>
        <v-row v-if="showFaq">
          <Information />
        </v-row>
        <v-row class="d-flex d-sm-none">
          <Information />
        </v-row>
        <LoginDialog
          @closeDialog="closeDialog"
          @loggedIn="loggedIn"
          :showDialog="showLogInBox"
        />
        <RegisterDialog
          @closeDialog="closeDialog"
          @loggedIn="loggedIn"
          :showDialog="showRegisterBox"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LoginDialog from "../components/LoginDialog/LoginDialog.vue";
import RegisterDialog from "../components/LoginDialog/RegisterDialog.vue";
import Information from "../components/Users/Information.vue";
import { mdiChevronDown, mdiChevronUp, mdiChevronRight } from "@mdi/js";

@Component({
  components: {
    LoginDialog,
    RegisterDialog,
    Information,
  },
})
export default class Welcome extends Vue {
  private showLogInBox = false;
  private showRegisterBox = false;
  private showFaq = false;
  private mdiChevronDown = mdiChevronDown;
  private mdiChevronUp = mdiChevronUp;
  private mdiChevronRight = mdiChevronRight;

  loggedIn(jwt: string) {
    const self = this;
    this.$store.dispatch("loggedInUser", {
      freshLogin: true,
      jwt,
      callback: () => {
        self.showLogInBox = false;
        self.showRegisterBox = false;
      },
    });
  }

  closeDialog() {
    this.showLogInBox = false;
    this.showRegisterBox = false;
  }

  atChevronClick() {
    this.showFaq = !this.showFaq;
  }

  imageHeight() {
    switch (this.$vuetify.breakpoint.name) {
      case "xs":
        return "140px";
      case "sm":
        return "280";
      case "md":
        return "200px";
      case "lg":
        return "400px";
      case "xl":
        return "550px";
    }
  }
}
</script>

<style scoped lang="css">
.icon {
  cursor: pointer;
}

.header {
  font-family: "Open Sans";
  font-weight: 500;
  margin-top: 8px;
  color: white;
}

@media screen and (min-width: 600px) {
  .header {
    font-size: 24px;
  }
}
@media screen and (min-width: 960px) {
  .header {
    font-size: 36px;
  }
}
@media screen and (min-width: 1264px) {
  .header {
    font-size: 42px;
  }
}
@media screen and (min-width: 1904px) {
  .header {
    font-size: 48px;
  }
}
</style>
