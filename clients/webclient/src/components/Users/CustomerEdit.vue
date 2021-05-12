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
                        label="Fornavn"
                        v-model="firstName"
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        label="Etternavn"
                        v-model="lastName"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="text-center">
                <v-col>
                    <v-text-field
                        label="Gateadresse"
                        v-model="address"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="text-center">
                <v-col cols="4">
                    <v-text-field
                        :rules="[numbers, postNoLength]"
                        label="Postnummer"
                        v-model="postNo"
                        required
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        label="Poststed"
                        v-model="postPlace"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="text-center">
                <v-col cols="4">
                    <v-text-field
                        :rules="[numbers, phoneNoLength]"
                        label="Telefonnummer"
                        v-model="phone"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <h4>Dine registrerte alleriger er</h4>
            </v-row>
            <v-row>
                {{ this.selectedAllergies }}
            </v-row>
            <v-row>
                <v-col>
                    <v-btn @click="sendToDb" color="primary" class="ma-1"
                        >Send inn</v-btn
                    >
                    <v-btn @click="cancel" color="secondary" class="ma-1"
                        >Avbryt</v-btn
                    >
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

@Component
export default class CustomerEdit extends Vue {
    @Prop() loggedInUser!: string;
    @Prop() userprofile!: Userprofile;
    private firstName = "";
    private lastName = "";
    private address = "";
    private postNo = "";
    private postPlace = "";
    private phone = "";

    async fillForm() {
        let user = await api.getUserprofile();
        let fn = user.fullname.split(" ");
        this.firstName = fn[0];
        this.lastName = fn[1];
        let a = user.address.split(" ");
        this.address = a[0] + " " + a[1];
        this.postNo = a[2];
        this.postPlace = a[3];
        this.phone = user.phone;
        this.selectedAllergies = user.allergies;
        console.log(this.userprofile)
    }

    async beforeMount() {
        this.fillForm();
    }

    private allergies = [
        { name: "Gluten", selected: false },
        { name: "Skalldyr", selected: false },
        { name: "Egg", selected: false },
        { name: "Fisk", selected: false },
        { name: "Peanøtter", selected: false },
        { name: "Nøtter", selected: false },
        { name: "Melk", selected: false },
        { name: "Soya", selected: false },
        { name: "Selleri", selected: false },
        { name: "Sennep", selected: false },
        { name: "Sesam", selected: false },
        { name: "Svovel", selected: false },
        { name: "Lupin", selected: false },
        { name: "Bløtdyr", selected: false },
    ];
    private selectedAllergies = [];

    // Rules:
    numbers(value: string) {
        return (
            !isNaN(parseInt(value)) || "Vennligst oppgi et gyldig postnummer"
        );
    }
    postNoLength(value: string) {
        return value.length == 4 || "Vennligst oppgi et gyldig postnummer";
    }
    phoneNoLength(value: string) {
        return value.length >= 8 || "Vennligst oppgi et gyldig telefonnummer";
    }

    async sendToDb() {
        let newUserprofile = {
            fullname: this.firstName + " " + this.lastName,
            address: this.address + " " + this.postNo + " " + this.postPlace,
            phone: this.phone.toString(),
            email: this.loggedInUser,
            allergies: this.selectedAllergies,
            isVendor: false,
        };

        await api.putUserprofile(newUserprofile);
        this.$emit("newUserprofile", newUserprofile);
    }

    cancel() {
        this.$emit("userprofile");
    }
}
</script>
