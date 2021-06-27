<template>
    <v-dialog v-model="showDialog" persistent max-width="500">
        <v-card>
            <TabRegister @showSpinner="showSpin" @loggedIn="loggedIn" />
        </v-card>
        <v-overlay absolute opacity="0.1" v-if="showSpinner">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import TabRegister from './TabRegister.vue';

@Component({
	components: {
        TabRegister
	},
})

export default class RegisterDialog extends Vue {
    @Prop( {
        default: true
    }) showDialog!: boolean;
    private tab = 0;
    private showSpinner = false;

    loggedIn(jwtToken: string) {
        this.$emit("loggedIn", jwtToken);
    }

    showSpin(value:boolean) {
        this.showSpinner = value;
    }
}
</script> 