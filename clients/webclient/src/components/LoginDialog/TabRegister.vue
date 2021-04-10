<template>
    <v-container>
        <v-card-title class="headline">Registrer konto</v-card-title>
        <v-card-text>
            <v-text-field 
                label="Fyll inn epost-adresse" 
                required
                v-model="username"
                >
            </v-text-field>
            <v-text-field 
                v-if="!showCodeVerification"
                label="Velg et passord" 
                required
                v-model="password1"
                :rules="[checkPassword]"
            >
            </v-text-field>
            <v-text-field 
                v-if="!showCodeVerification"
                label="Gjenta passord" 
                required
                v-model="password2"
                :rules="[checkEqual]"
            >
            </v-text-field>
            <p style="color:red;"> {{errorMsg1}}</p>
            <v-text-field 
            v-if="showCodeVerification"
            label="Fyll inn kode fra epost" 
            required
            v-model="code"
            >
            </v-text-field>
            <p style="color:red;"> {{errorMsg2}}</p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
                v-if="!showCodeVerification"
                color="success" 
                @click="register"
            >
            Registrer
            </v-btn>
            <v-btn 
                v-else
                color="success" 
                @click="verifyCode"
            >
            Verifiser
            </v-btn>
            <v-btn 
                color="error" 
                @click="cancel"
            >  
            Avbryt
            </v-btn>
        </v-card-actions>
        
    </v-container>
</template>



<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import getAuth from "./auth";

@Component

export default class TabRegister extends Vue {
    private username = "";
    private password1 = "";
    private password2 = "";
    private code = "";
    private errorMsg1 = "";
    private errorMsg2 = "";
    private showCodeVerification = false;
    private Auth = getAuth();

    cancel() {
        this.$emit("cancel");
    }

    checkPassword(pass1: string) {
        return pass1.length > 6 || "Passord må være minst 6 bokstaver";
    }
    checkEqual(pass2: string) {
        return pass2 === this.password1 || "Passordene er ikke like"
    }

    async register() {
        let params = {
            username: this.username,
            password: this.password2
        }
        try {
            let signUp = await this.Auth.signUp(params);
            console.log(signUp);
            this.showCodeVerification = true;
        } catch (err) {
            this.errorMsg1 = err.message;
        }
    }
    async verifyCode() {
        try {
            let confirmedSignUp = await this.Auth.confirmSignUp(this.username, this.code);
            if (confirmedSignUp === "SUCCESS") {
                let signIn = await this.Auth.signIn(this.username, this.password2);
                console.dir(signIn);
                // TODO: Lukke dialogboks og redirect til profilside
            }
        } catch (err) {
            this.errorMsg2 = err.message;
        }
    }
}
</script>