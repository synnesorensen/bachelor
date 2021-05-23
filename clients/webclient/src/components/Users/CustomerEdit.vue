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
                        v-model="fullname"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="text-center">
                <v-col>
                    <v-text-field
                        label="Adresse"
                        v-model="address"
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
                <v-col>
                    <v-text-field
                        label="E-post"
                        v-model="email"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <h4>Dine registrerte alleriger er</h4>
            </v-row>
            <v-row>
                {{ this.allergies }}
            </v-row>
            <v-row>
                <v-col>
                    <v-btn @click="sendToDb" color="primary" class="ma-1"
                        >Send inn</v-btn
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
import CustomerProfile from "../Users/CustomerProfile.vue";

@Component({
    components: {
        CustomerProfile,
    },
})
export default class CustomerEdit extends Vue {
    @Prop() loggedInUser!: string;
    @Prop() userprofile!: Userprofile;
    private fullname = "";
    private address = "";
    private phone = "";
    private email = "";
    private allergies: string[] = [];

    async fillForm() {
        let user = await api.getUserprofile();
        if (user) {
            this.fullname = user.fullname;
            this.address = user.address;
            this.phone = user.phone;
            this.email = user.email;
            this.allergies = user.allergies;
            console.log(this.userprofile);
        }
    }

    async beforeMount() {
        this.fillForm();
    }

    numbers(value: string) {
        return (
            !isNaN(parseInt(value)) || "Vennligst oppgi et gyldig postnummer"
        );
    }

    phoneNoLength(value: string) {
        return value.length >= 8 || "Vennligst oppgi et gyldig telefonnummer";
    }

    async sendToDb() {
        let updateUserprofile = {
            fullname: this.fullname,
            address: this.address,
            phone: this.phone.toString(),
            email: this.email,
            allergies: this.allergies,
            isVendor: false,
        };

        await api.putUserprofile(updateUserprofile);
        this.$emit("save");
    }
}
</script>
