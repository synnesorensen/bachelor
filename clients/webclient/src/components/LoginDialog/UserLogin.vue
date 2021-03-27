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
            <v-btn color="primary" @click="showDialog = false">Logg inn</v-btn>
            <v-btn color="red" @click="showDialog = false">Avbryt</v-btn>
        </v-card-actions>

    </v-container>
</template>





<script>
export default {

}
</script>
