<template>
    <v-card>
        <v-card-title>Valgt kunde</v-card-title>
        <br />
        <v-card-text v-if="!selectedUser">
            <v-row>
                <v-col>
                    <p> Velg en kunde </p>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-if="selectedUser">
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-medium"> Navn </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{ selectedUser.fullname }} </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-medium"> Adresse </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{ selectedUser.address }} </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-medium"> Telefon </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{ selectedUser.phone }} </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2">
                    <p class="font-weight-medium"> Epost </p>
                </v-col>
                <v-col>
                    <p class="font-weight-light"> {{ selectedUser.email }} </p>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
      <v-btn v-if="selectedUser" color="primary">Lag faktura </v-btn>
    </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import * as interfaces from "../../../../../server/src/interfaces";

@Component
export default class CustomerInvoice extends Vue {
    @Prop() selectedUser:interfaces.UserSubscription | null = null; 


    
}
</script>