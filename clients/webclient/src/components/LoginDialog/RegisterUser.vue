<template>
    <v-container>
        <v-card-title class="headline">Registrer konto</v-card-title>
        <v-card-text>
            <v-text-field label="Fyll inn epost-adresse" required></v-text-field>
            <v-text-field label="Passord" required></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success">Registrer</v-btn>
            <v-btn color="error" @click="cancel()">Avbryt</v-btn>
        </v-card-actions>
    </v-container>
</template>



<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component

export default class RegisterUser extends Vue {

    cancel() {
        this.$emit("cancel");
    }
}
</script>