<template>
    <v-container>
        <v-card-title class="headline">Registrer konto</v-card-title>
        <v-card-text>
            <v-text-field label="Fyll inn epost-adresse" required></v-text-field>
            <v-text-field label="Passord" required></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showDialog = false">Registrer</v-btn>
            <v-btn color="red" @click="showDialog = false">Avbryt</v-btn>
        </v-card-actions>

    </v-container>
</template>





<script>
export default {

}
</script>