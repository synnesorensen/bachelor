<template>
  <v-container >
    <v-row justify="center" dense>
      <v-col :xl="8" :lg="8" :md="10">
        <v-row>
          <v-img
            src="..\..\assets\BA.jpg"
            required
            height="40%"
            gradient="to bottom right, rgba(10,10,10,0.3),rgba(0,0,0,0)"
          >
            <v-col>
              <v-row
                style="
                    background-color: rgba(30,30,30,0.1)
                    border-radius: 2px"
              >
                <v-col :xl="8" :lg="8" :md="10">
                  <v-row class="ml-4">
                    <p class="mt-8 text-h4 white--text">Velkommen til Lunsj på Hjuls kundesider</p>
                  </v-row>
                </v-col>
                <v-col >
                  <v-row class="justify-end mt-4 mr-4">
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-img>
        </v-row>
        <v-row class="mt-8 px-48">
          <v-col cols="4">
            <v-card height="350">
              <v-img
                src="..\..\assets\Kort1.jpg"
                class="white--text align-end"
                height="280px"
              ></v-img>
              <v-card-title>Logg inn</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card height="350">
              <v-img
                src="..\..\assets\Kort2.jpg"
                class="white--text align-end"
                @click="showRegisterBox = true"
                height="280px"
              ></v-img>
              <v-card-title @click="showRegisterBox = true">Registrer deg</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card height="350">
              <v-img
                src="..\..\assets\tilbake.jpeg"
                class="white--text align-end"
                height="280px"
              ></v-img>
              <v-card-title>Tilbake til websider</v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <p v-if="!showFaq">Vis informasjon</p>
          <p v-else>Lukk informasjon</p>
        </v-row>
        <v-row 
          class="justify-center" 
        >
          <v-icon 
            v-if="!showFaq"
            x-large 
            @click="atChevronClick"  
          >
            {{mdiChevronDown}}
          </v-icon>
          <v-icon 
            v-else
            x-large 
            @click="atChevronClick"  
          >
            {{mdiChevronUp}}
          </v-icon>
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
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';

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