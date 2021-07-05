<template>
    <v-container>
        <v-form v-model="isFormValid">
            <v-row>
                <v-col>
                    <h1>Kunderegistrering</h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col :xl="6" :lg="6">
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                label="Fornavn"
                                v-model="firstName"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                label="Etternavn"
                                v-model="lastName"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                label="Hjemmeadresse"
                                v-model="address"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                :rules="[numbers, postNoLength]"
                                label="Postnummer"
                                v-model="postNo"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                label="Poststed hjemmeadresse"
                                v-model="postPlace"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                label="Leveringsadresse"
                                v-model="deliveryaddress"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                :rules="[numbers, postNoLength]"
                                label="Postnummer"
                                v-model="delPostNo"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                label="Poststed leveringsadresse"
                                v-model="delPostPlace"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="text-center">
                        <v-col>
                            <v-text-field
                                :rules="[numbers, phoneNoLength]"
                                label="Telefonnummer"
                                v-model="phone"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <p class="font-weight-medium">Allergier:</p>
            </v-row>
            <v-row>
                <v-col
                    class="d-flex"
                    cols="12"
                    sm="6"
                >
                    <v-select
                    v-model="value"
                    :items="allergies"
                    solo
                    chips
                    label="Velg alle aktuelle"
                    multiple
                    ></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col :xl="6" :lg="6">
                    <v-text-field
                        label="Eventuelle merknader"
                        v-model="add"
                        counter
                        maxlength="80"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col :xl="2" :lg="3">
                    <v-tooltip :disabled="isFormValid" right>
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-btn 
                                    @click="cancel" 
                                    color="error"
                                    class="ma-2"
                                >
                                    Avbryt
                                </v-btn>
                                <v-btn 
                                    @click="sendToDb" 
                                    color="primary" 
                                    :disabled="!isFormValid"
                                    class="ma-2"
                                >
                                    Send inn
                                </v-btn>
                            </div>
                        </template>
                        <span>Vennligst fyll ut alle påkrevde felt</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import api from "../api/api";
import {Vendor} from "../../../../server/src/interfaces";

@Component
export default class RegisterAccount extends Vue {
    private isFormValid = false;
    private vendor: Vendor | null = null;
    private firstName = "";
    private lastName = "";
    private address = "";
    private postNo = "";
    private postPlace = "";
    private deliveryaddress = "";
    private delPostNo = "";
    private delPostPlace = "";
    private phone = "";
    private allergies = ["Gluten","Skalldyr","Egg","Fisk","Peanøtter","Nøtter","Melk", "Soya", "Selleri","Sennep", "Sesam", "Svovel", "Lupin", "Bløtdyr"];
    private value = [];
    private add = "";               // TODO: Knytte dette feltet til epost sendt til vendor ved registrering

    async sendToDb() {
        if (this.vendor?.vendorId) {
            let newUserprofile = {
                fullname: this.firstName + " " + this.lastName,
                address: this.address + " " + this.postNo + " " + this.postPlace,
                deliveryaddress: this.deliveryaddress + " " + this.delPostNo + " " + this.delPostPlace,
                phone: this.phone.toString(),
                email: this.$store.getters.loggedInUser,
                allergies: this.value,
                isVendor: false,
            };
            await api.putUserprofile(newUserprofile);
            this.$store.commit("setUserprofile", newUserprofile);
            this.$emit("loggedIn", localStorage.getItem("token"));
            // Her skjer det ikke noe mer
        }
    }

    cancel() {
        this.$router.push({name: 'welcome'});
    }

    // Rules:
    numbers(value: string) {
        return !isNaN(parseInt(value)) || "Vennligst oppgi kun siffer";
    }
    postNoLength(value: string) {
        return value.length == 4 || "Vennligst oppgi et postnummer bestående av 4 siffer";
    }
    phoneNoLength(value: string) {
        return value.length >= 8 || "Vennligst oppgi et telefonnummer bestående av 8 siffer";
    }
}
</script>
