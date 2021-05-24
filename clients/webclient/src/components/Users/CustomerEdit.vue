<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col>
                    <h1>Endre profil</h1>
                </v-col>
            </v-row>
            <v-row class="text-center">
                <v-col>
                    <v-text-field
                        label="Fullt navn"
                        v-model="userprofile.fullname"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="text-center">
                <v-col>
                    <v-text-field
                        label="Adresse"
                        v-model="userprofile.address"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="text-center">
                <v-col cols="4">
                    <v-text-field
                        :rules="[numbers, phoneNoLength]"
                        label="Telefonnummer"
                        v-model="userprofile.phone"
                        required
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        label="E-post"
                        v-model="userprofile.email"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <h4>Har du noen allergier</h4>
            </v-row>
            <v-row>
                <v-chip-group
                    v-model="userprofile.allergies"
                    active-class="blue--text text--accent-4"
                    multiple
                >
                    <v-chip
                        v-for="allergy in allergies"
                        v-bind:key="allergy.name"
                        v-bind:value="allergy.name"
                        v-model="allergy.selected"
                        filter
                        outlined
                    >
                        {{ allergy.name }}
                    </v-chip>
                </v-chip-group>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn @click="sendToDb" color="primary" class="ma-1">
                        Send inn
                    </v-btn>
                    <v-btn color="secondary" @click="cancel" class="ma-1">
                        Avbryt
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import api from "../../api/api";
import { Userprofile } from "../../../../../server/src/interfaces";
import CustomerProfile from "../Users/CustomerProfile.vue";

@Component({
    components: {
        CustomerProfile,
    },
})
export default class CustomerEdit extends Vue {
    @Prop() userprofile!: Userprofile;

        private allergies = [
        { name: "gluten", selected: false },
        { name: "skalldyr", selected: false },
        { name: "egg", selected: false },
        { name: "fisk", selected: false },
        { name: "peanøtter", selected: false },
        { name: "nøtter", selected: false },
        { name: "melk", selected: false },
        { name: "soya", selected: false },
        { name: "selleri", selected: false },
        { name: "sennep", selected: false },
        { name: "sesam", selected: false },
        { name: "svovel", selected: false },
        { name: "lupin", selected: false },
        { name: "bløtdyr", selected: false },
    ];
        private selectedAllergies = this.userprofile.allergies;

    numbers(value: string) {
        return (
            !isNaN(parseInt(value)) || "Vennligst oppgi et gyldig postnummer"
        );
    }

    phoneNoLength(value: string) {
        return value.length >= 8 || "Vennligst oppgi et gyldig telefonnummer";
    }

    async sendToDb() {
        
        await api.putUserprofile(this.userprofile);
        this.$emit("switchToCustomerProfile");
    }

    async cancel() {
        let unchangedUserprofile = await api.getUserprofile();
        if (unchangedUserprofile) {
            this.userprofile.fullname = unchangedUserprofile.fullname;
            this.userprofile.address = unchangedUserprofile.address;
            this.userprofile.phone = unchangedUserprofile.phone;
            this.userprofile.email = unchangedUserprofile.email;
            this.userprofile.allergies = unchangedUserprofile.allergies;
        }
        this.$emit("switchToCustomerProfile");
    }
}
</script>
