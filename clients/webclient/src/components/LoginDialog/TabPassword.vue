<template>
    <v-container>
        <v-card-title class="headline">Glemt passord?</v-card-title>
        <v-card-text>
            <v-text-field 
                v-if="!showVerification"
                v-model="username"
                label="Fyll inn epost-adresse" 
                required
                >
            </v-text-field>
            <v-text-field 
                v-if="showVerification"
                label="Fyll inn kode fra epost" 
                required
                v-model="code"
                >
            </v-text-field>
            <v-text-field 
                v-if="showVerification"
                label="Fyll inn nytt passord" 
                required
                v-model="password1"
                :rules="[checkPassword]"
                >
            </v-text-field>
            <v-text-field 
                v-if="showVerification"
                label="Gjenta nytt passord" 
                required
                v-model="password2"
                :rules="[checkEqual]"
                >
            </v-text-field>
        </v-card-text>
        <p style="color:red;"> {{errorMsg}}</p>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
                v-if="!showVerification"
                color="success" 
                @click="sendPassword"
            >
            Send
            </v-btn>
            <v-btn 
                v-else
                color="success" 
                @click="verifyPassword"
                :disabled = "check()"
            >
            Send
            </v-btn>
            <v-btn color="error" @click="cancel()">Avbryt</v-btn>
        </v-card-actions>
    </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import getAuth from "./auth";

@Component

export default class TabPassword extends Vue {
    private username = "";
    private code = "";
    private password1 = "";
    private password2 = "";
    private Auth = getAuth();
    private showVerification = false;
    private errorMsg = "";
    
    // Rules:
    checkPassword(pass1: string) {
        return pass1.length > 6 || "Passord må være minst 6 bokstaver";
    }
    checkEqual(pass2: string) {
        return pass2 === this.password1 || "Passordene er ikke like"
    }

    check() {
        return this.password1!=this.password2 || this.code == "";
    }

    sendPassword() {
        this.Auth.forgotPassword(this.username);
        this.showVerification = true;
    }

    async verifyPassword() {
        try {
            await this.Auth.forgotPasswordSubmit(this.username, this.code, this.password2);
            await this.Auth.signIn(this.username, this.password2);

            // TODO: Lukke dialogboks og logge inn 
        } catch (err) {
            this.errorMsg = err.message;
        }
    }

    cancel() {
        this.$emit("cancel");
    }

}
</script>