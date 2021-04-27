<template>
    <v-container v-if="loggedInUser">
        <v-row>
            <v-col>
                <h2>Registrert informasjon</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col :cols="2">
                <p class="font-weight-medium">Navn</p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ loggedInUser.fullname }} </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col :cols="2">
                <p class="font-weight-medium">Firmanavn</p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ loggedInUser.company }} </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col :cols="2">
                <p class="font-weight-medium">Adresse</p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ loggedInUser.address }} </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col :cols="2">
                <p class="font-weight-medium">Telefonnummer</p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ loggedInUser.phone }} </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col :cols="2">
                <p class="font-weight-medium">E-post</p>
            </v-col>
            <v-col>
                <p class="font-weight-light"> {{ loggedInUser.email }} </p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getUserprofile, getVendor } from "../../api/api";
import * as interfaces from "../../../../../server/src/interfaces"

@Component
export default class CustomerProfile extends Vue {
    private loggedInUser:interfaces.Vendor = null;
    
    async created() {
        const response = await getUserprofile();
        const vendor = await getVendor("v#" + response.email);
        this.loggedInUser = vendor;
    }

}

</script>