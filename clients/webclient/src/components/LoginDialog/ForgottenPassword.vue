<template>
    <v-container>
        <v-card-title class="headline">Glemt passord?</v-card-title>
        <v-card-text>
            <v-text-field label="Fyll inn epost-adresse" required></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showDialog = false">Send</v-btn>
            <v-btn color="red" @click="showDialog = false">Avbryt</v-btn>
        </v-card-actions>

    </v-container>
</template>





<script>
export default {

}
</script>