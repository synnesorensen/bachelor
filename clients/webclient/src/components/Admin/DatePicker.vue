<template>
    <v-layout row wrap>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <v-text-field
                    :value="selectedDate"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-on="on"
                ></v-text-field>
            </template>
        <v-date-picker
            v-model="selectedDate"
            :first-day-of-week="1"
            locale="no"
            @input="updateDate(selectedDate)"
            no-title
        ></v-date-picker>
        </v-menu>
    </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component

export default class CustomerPayment extends Vue {
    @Prop() date = "";
    private menu = false;
    private selectedDate = "";

    @Watch("date") 
    dateChanged() {
        this.selectedDate = this.date;
    }

    updateDate(date: string) {
        this.menu = false;
        this.selectedDate = date;
        this.$emit("update:date", this.selectedDate);
        this.$emit("blur", this.selectedDate);
    }

}
</script>