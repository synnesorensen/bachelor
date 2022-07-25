<template>
  <v-container fluid>
    <v-row justify="center" dense>
      <v-col :xl="8" :lg="8" :md="10">
        <v-row>
          <v-col cols="12" class="pa-0">
            <v-card>
              <v-img
                src="../assets/egg.jpg"
                required
                gradient="to bottom right, rgba(10,10,10,0.3),rgba(0,0,0,0)"
                :height="imageHeight()"
              >
                <v-col>
                  <v-row
                    height
                    style="
                      background-color: rgba(30,30,30,0.4)
                      border-radius: 2px"
                  >
                    <v-col cols="12">
                      <v-row class="ml-4">
                        <p class="header">
                          LUNSJ PÅ HJUL KUNDEPORTAL
                        </p>
                        <v-spacer class="d-none d-sm-flex"></v-spacer>
                        <v-item-group class="d-none d-sm-flex ma-4">
                          <v-btn
                            @click="showRegisterBox = true"
                            text
                            color="white"
                            >Registrer</v-btn
                          >
                          <v-btn @click="showLogInBox = true" color="white"
                            >Logg inn</v-btn
                          >
                        </v-item-group>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row class="d-flex d-sm-none justify-end mt-16 pr-6">
                    <v-col cols="3">
                      <!-- MOBILE -->
                      <v-item-group>
                        <v-btn
                          x-small
                          @click="showRegisterBox = true"
                          text
                          color="white"
                          >Registrer</v-btn
                        >
                        <v-btn
                          x-small
                          @click="showLogInBox = true"
                          color="white"
                          >Logg inn</v-btn
                        >
                      </v-item-group>
                    </v-col>
                  </v-row>
                </v-col>
              </v-img>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="my-4 d-none d-sm-flex">
          <v-col cols="4" class="pa-2">
            <v-card height="350">
              <v-img
                src="../assets/graut2.jpg"
                class="white--text align-end"
                max-height="280px"
              ></v-img>
              <v-card-title
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
              >
                <v-spacer></v-spacer>
                <p>GRAUTATYSDAG</p>
                <v-spacer></v-spacer>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="4" class="pa-2">
            <v-card height="350">
              <v-img
                src="../assets/salat2.jpg"
                class="white--text align-end"
                max-height="280px"
              ></v-img>
              <v-card-title
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
              >
                <v-spacer></v-spacer>
                <p>ONSDAGSSALATEN</p>
                <v-spacer></v-spacer>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="4" class="pa-2">
            <v-card height="350">
              <v-img
                src="../assets/fisk2.jpg"
                class="white--text align-end"
                max-height="280px"
              ></v-img>
              <v-card-title
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
              >
                <v-spacer></v-spacer>
                <p>PÅKEBÅOL TORSDAG</p>
                <v-spacer></v-spacer>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" class="d-none d-sm-flex">
          <p class="ma-0" v-if="!showFaq">Vis informasjon</p>
          <p class="ma-0" v-else>Lukk informasjon</p>
        </v-row>
        <v-row align="center" justify="center" class="ma-0 d-none d-sm-flex">
          <v-icon v-if="!showFaq" x-large @click="atChevronClick">
            {{ mdiChevronDown }}
          </v-icon>
          <v-icon v-else x-large @click="atChevronClick">
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
        return "200px";
      case "sm":
        return "300px";
      case "md":
        return "400px";
      case "lg":
        return "400px";
      case "xl":
        return "500px";
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
