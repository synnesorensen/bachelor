<template>
  <v-container>
    <v-row justify="center" dense>
      <v-col :xl="8" :lg="8" :md="10">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-img
                src="..\..\assets\BA.jpg"
                required
                gradient="to bottom right, rgba(10,10,10,0.3),rgba(0,0,0,0)"
                height="700"              >
                <v-col>
                  <v-row
                    style="
                    background-color: rgba(30,30,30,0.1)
                    border-radius: 2px"
                  >
                    <v-col :xl="8" :lg="8" :md="10">
                      <v-row class="ml-4">
                        <p class="mt-8 text-h4 white--text">
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
        <v-row class="my-4">
          <v-col cols="4">
            <v-card height="450">
              <v-img
                src="..\..\assets\Kort1.jpg"
                class="white--text align-end"
                height="380px"
                @click="showLogInBox = true"
                style="cursor: pointer"
              ></v-img>
              <v-card-title @click="showLogInBox = true" style="cursor: pointer"
                >Logg inn</v-card-title
              >
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card height="450">
              <v-img
                src="..\..\assets\Kort2.jpg"
                class="white--text align-end"
                height="380px"
                @click="showRegisterBox = true"
                style="cursor: pointer"
              ></v-img>
              <v-card-title
                @click="showRegisterBox = true"
                style="cursor: pointer"
                >Registrer deg</v-card-title
              >
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card height="450">
              <v-img
                src="..\..\assets\tilbake.jpeg"
                class="white--text align-end"
                height="380px"
              ></v-img>
              <v-card-title>Tilbake til stenematglede.com</v-card-title>
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
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

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
}
</script>

<style scoped>
.icon {
  cursor: pointer;
}
</style>