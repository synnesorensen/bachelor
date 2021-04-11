<template>
    <v-dialog v-model="showDialog" persistent max-width="500">
        <v-card>
            <v-tabs v-model="tab" align-with-title>
                <v-tab>Logg inn</v-tab>
                <v-tab>Registrer deg</v-tab>
                <v-tab>Glemt passord</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item :transition="false" :reverse-transition="false"><TabLogin @loggedIn="loggedIn"  @cancel="closeBox" /></v-tab-item>
                <v-tab-item :transition="false" :reverse-transition="false"><TabRegister @loggedIn="loggedIn" @cancel="closeBox" /></v-tab-item>
                <v-tab-item :transition="false" :reverse-transition="false"><TabPassword @loggedIn="loggedIn" @cancel="closeBox" /></v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import TabLogin from "./TabLogin.vue"
import TabRegister from "./TabRegister.vue"
import TabPassword from "./TabPassword.vue"

@Component({
	components: {
        TabLogin,
		TabRegister,
        TabPassword
	},
})

export default class LoginDialog extends Vue {

    public showDialog = true;
    private tab = 0;

    openBox() {
        this.showDialog = true;
    }

    closeBox() {
        this.showDialog = false;
    }

    loggedIn(jwtToken: string) {
        this.$emit("loggedIn", jwtToken);
    }
}
</script>