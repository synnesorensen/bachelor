<template>
    <div>
        <v-row dense>
            <v-col :xl="4" :lg="5">
                <p class="font-weight-medium"> Navn </p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ selectedUser.fullname }} </p>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col :xl="4" :lg="5">
                <p class="font-weight-medium"> Adresse </p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ selectedUser.address }} </p>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col :xl="4" :lg="5">
                <p class="font-weight-medium"> Telefon </p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ selectedUser.phone }} </p>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col :xl="4" :lg="5">
                <p class="font-weight-medium"> Epost </p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ selectedUser.email }} </p>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col :xl="4" :lg="5">
                <p class="font-weight-medium"> Status </p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ selectedUser.paused ? "Pauset" : "Aktiv" }} </p>
            </v-col>
        </v-row>
    </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import * as interfaces from "../../../../../common/interfaces";

@Component({
	components: {
	},
})
export default class CustomerInfo extends Vue {
    @Prop() selectedUser!:interfaces.UserSubscription | null; 

}
</script>