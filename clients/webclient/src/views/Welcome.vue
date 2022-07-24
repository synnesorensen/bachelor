<template>
  <v-container fluid>
    <v-row justify="center" dense>
      <v-col :xl="8" :lg="8" :md="10">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-img
                src="../assets/BA.jpg"
                required
                gradient="to bottom right, rgba(10,10,10,0.3),rgba(0,0,0,0)"
                :height="imageHeight()"
              >
                <v-col>
                  <v-row
                    style="
                    background-color: rgba(30,30,30,0.1)
                    border-radius: 2px"
                  >
                    <v-col cols="11">
                      <v-row class="ml-4">
                        <p class="header">
                          Velkommen til Lunsj på Hjuls kundesider
                        </p>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row class="justify-end mt-4 mr-4"> </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-img>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="center" class="d-flex d-sm-none ma-4">
          <v-col cols="auto">
            <v-row class="my-2">
              <v-btn width="200px" color="white" @click="showLogInBox = true"
                >Logg inn</v-btn
              >
            </v-row>
            <v-row class="my-2">
              <v-btn width="200px" color="white" @click="showRegisterBox = true"
                >Registrer deg</v-btn
              >
            </v-row>
            <v-row class="my-2">
              <v-btn 
                href="https://www.stenematglede.com/lunsjpaahjul"
                width="200px" color="white">Stene matglede</v-btn>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="my-4 d-none d-sm-flex">
          <v-col cols="4" class="pa-2">
            <v-card height="350">
              <v-img
                src="../assets/Kort1.jpg"
                class="white--text align-end"
                max-height="280px"
                @click="showLogInBox = true"
                style="cursor: pointer"
              ></v-img>
              <v-card-title
                @click="showLogInBox = true"
                style="cursor: pointer"
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
              >
                Logg inn
                <v-spacer></v-spacer>
                <v-icon>{{ mdiChevronRight }}</v-icon>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="4" class="pa-2">
            <v-card height="350">
              <v-img
                src="../assets/Kort2.jpg"
                class="white--text align-end"
                max-height="280px"
                @click="showRegisterBox = true"
                style="cursor: pointer"
              ></v-img>
              <v-card-title
                @click="showRegisterBox = true"
                style="cursor: pointer;"
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
              >
                Registrer deg
                <v-spacer></v-spacer>
                <v-icon>{{ mdiChevronRight }}</v-icon>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="4" class="pa-2">
            <v-card 
              href="https://www.stenematglede.com/lunsjpaahjul" 
              height="350"
            >
              <v-img
                src="../assets/tilbake.jpeg"
                class="white--text align-end"
                max-height="280px"
                style="cursor: pointer"
              ></v-img>
              <v-card-title
                style="cursor: pointer"
                :class="{
                  caption: $vuetify.breakpoint.smAndDown,
                  'subtitle-1': $vuetify.breakpoint.md,
                  'h-6': $vuetify.breakpoint.lgAndUp,
                }"
              >
                Stene matglede
                <v-spacer></v-spacer>
                <v-icon>{{ mdiChevronRight }}</v-icon>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <p class="ma-0" v-if="!showFaq">Vis informasjon</p>
          <p class="ma-0" v-else>Lukk informasjon</p>
        </v-row>
        <v-row class="ma-0 justify-center">
          <v-col cols="1">
            <v-icon v-if="!showFaq" x-large @click="atChevronClick">
              {{ mdiChevronDown }}
            </v-icon>
            <v-icon v-else x-large @click="atChevronClick">
              {{ mdiChevronUp }}
            </v-icon>
          </v-col>
        </v-row>
        <v-row v-if="showFaq">
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
