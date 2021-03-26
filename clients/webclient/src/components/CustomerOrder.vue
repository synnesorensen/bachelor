<template>
	<v-container> 
		<v-row class="text-center">
			<v-col cols="12">
				<h3>Dette er CustomerOrder-komponenten</h3>
			</v-col>
		</v-row>
		<v-row class="text-center">
			<v-col>
				<v-text-field label ="Fornavn" v-model="Fornavn"></v-text-field>
			</v-col>
            <v-col>
                <v-text-field label ="Etternavn" v-model="Etternavn"></v-text-field>
			</v-col>
		</v-row>
        <v-row class ="text-center">
            <v-col>
                <v-text-field label="Gateadresse" v-model="Gateadresse"></v-text-field>
            </v-col>
        </v-row>
        <v-row class ="text-center">
            <v-col>
                <v-text-field label="Postnummer" v-model="Postnummer"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field label="Poststed" v-model="Poststed"></v-text-field>
            </v-col>
        </v-row>
        <v-row class="text-center">
            <v-col>
                <v-checkbox label="Tirsdag" v-model="tirsdag"></v-checkbox>
            </v-col>
            <v-col>
                <v-checkbox label="Onsdag" v-model="onsdag"></v-checkbox>
            </v-col>
            <v-col>
                <v-checkbox label="Torsdag" v-model="onsdag"></v-checkbox>
            </v-col>
            <v-col>
                <v-checkbox label="Onsdag" v-model="torsdag"></v-checkbox>
            </v-col>
        </v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class CustomerOrder extends Vue {
    
}
</script>
