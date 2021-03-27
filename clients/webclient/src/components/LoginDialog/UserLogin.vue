<template>
    <v-container>
        <v-card-title class="headline">Logg inn til din konto</v-card-title>
        <v-card-text>
            <p>Vennligst oppgi brukernavn og passord</p>
            <v-text-field label="Brukernavn" required></v-text-field>
            <v-text-field label="Passord" required></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary">Logg inn</v-btn>
            <v-btn color="error" @click="cancel()">Avbryt</v-btn>
        </v-card-actions>

    </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component

export default class UserLogin extends Vue {

    cancel() {
        this.$emit("cancel");
    }

}
</script>
