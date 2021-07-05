<template>
    <v-dialog v-model="showDialog" persistent max-width="500">
        <v-card>
            <v-tabs v-model="tab" align-with-title>
                <v-tab>Logg inn</v-tab>
                <v-tab>Glemt passord</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item  :transition="false" :reverse-transition="false"><TabLogin @showSpinner="showSpin" @loggedIn="loggedIn" @closeDialog="closeDialog" /></v-tab-item>
                <v-tab-item :transition="false" :reverse-transition="false"><TabPassword @showSpinner="showSpin" @loggedIn="loggedIn" @closeDialog="closeDialog" /></v-tab-item>
            </v-tabs-items>
        </v-card>
        <v-overlay absolute opacity="0.1" v-if="showSpinner">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import TabLogin from "./TabLogin.vue";
import TabPassword from "./TabPassword.vue";

@Component({
	components: {
        TabLogin,
        TabPassword
	},
})

export default class LoginDialog extends Vue {
    @Prop( {
        default: true
    }) showDialog!: boolean;
    private tab = 0;
    private showSpinner = false;

    loggedIn(jwtToken: string) {
        this.$emit("loggedIn", jwtToken);
    }

    showSpin(value:boolean) {
        this.showSpinner = value;
    }

    closeDialog() {
        this.$emit("closeDialog", true);
    }
}
</script> 