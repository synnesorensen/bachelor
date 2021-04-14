<template>
    <v-form>
		<v-container> 
			<v-row>
				<v-col>
					<h1>Bestill lunsj</h1>
				</v-col>
			</v-row>
			<v-row class="text-center">
				<v-col>
					<v-text-field label ="Fornavn" v-model="firstName"></v-text-field>
				</v-col>
            	<v-col>
                	<v-text-field label ="Etternavn" v-model="lastName"></v-text-field>
				</v-col>
			</v-row>
        	<v-row class ="text-center">
            	<v-col>
                	<v-text-field label="Gateadresse" v-model="address"></v-text-field>
            	</v-col>
        	</v-row>
        	<v-row class ="text-center">
            	<v-col cols="4">
                	<v-text-field :rules="[numbers, length]" label="Postnummer" v-model="postNo"></v-text-field>
            	</v-col>
            	<v-col>
                	<v-text-field label="Poststed" v-model="postPlace"></v-text-field>
            	</v-col>
        	</v-row>
        	<v-row>
            	<h4>Antall porsjoner</h4>
        	</v-row>
        	<v-row>
            	<v-chip-group active-class="blue--text text--accent-4" mandatory>
                	<v-chip filter outlined>
                    	1
                	</v-chip>
                	<v-chip filter outlined>
                    	2
                	</v-chip>
                	<v-chip filter outlined>
                    	3
                	</v-chip>
                	<v-chip filter outlined>
                    	4
                	</v-chip>
                	<v-chip filter outlined>
                    	5
                	</v-chip>
                	<v-chip filter outlined>
                    	6
                	</v-chip>
                	<v-chip filter outlined>
                    	7
                	</v-chip>
                	<v-chip filter outlined>
                    	8
                	</v-chip>
                	<v-chip filter outlined>
                    	9
                	</v-chip>
                	<v-chip filter outlined>
                    	10
                	</v-chip>
            	</v-chip-group>
        	</v-row>      
        	<v-row>
            	<h4>Velg ønsket levering</h4>
        	</v-row>
        	<v-row>
            	<v-chip-group active-class="blue--text text--accent-4" multiple>
                	<v-chip filter outlined>
                    	Lunsj tirsdag
                	</v-chip>
                	<v-chip filter outlined>
                    	Lunsj onsdag
                	</v-chip>
                	<v-chip filter outlined>
                    	Lunsj torsdag
                	</v-chip>
                	<v-chip filter outlined>
                    	Middag torsdag
                	</v-chip>
            	</v-chip-group>
        	</v-row>
        	<v-row>
            	<h4>Hvor mange leveringer ønsker du?</h4>
        	</v-row>
        	<v-row>
            	<v-chip-group active-class="blue--text text--accent-4" mandatory>
                	<v-chip filter outlined>
                    	Enkel levering (kr. 149)
                	</v-chip>
                	<v-chip filter outlined>
                    	Abonnement (kr. 137 per levering)
                	</v-chip>
            	</v-chip-group>
        	</v-row>
        	<v-row>
            	<h4>Hvilken type bokser ønsker du?</h4>
        	</v-row>
        	<v-row>
            	<v-chip-group active-class="blue--text text--accent-4" mandatory>
                	<v-chip filter outlined>
                    	Engangsbokser
                	</v-chip>
                	<v-chip filter outlined>
                    	Gjenbruksbokser (depositum kr. 218)
                	</v-chip>
            	</v-chip-group>
        	</v-row>
        	<v-row>
            	<h4>Har du noen allergier</h4>
        	</v-row>
        	<v-row>
            	<v-chip-group active-class="blue--text text--accent-4" multiple>
                	<v-chip 
                        v-for="allergy in allergies" 
                        v-bind:key="allergy.name" 
                        v-model="allergy.selected"
                        filter outlined>
                    {{allergy.name}}
                	</v-chip>
            	</v-chip-group>
        	</v-row>
        	<v-row>
            	<v-text-field label="Annen informasjon du vil legge til?" v-model="add"></v-text-field>
        	</v-row>
        	<v-row>
            	<v-btn @click="sendToDb">Send</v-btn>
        	</v-row>
		</v-container>
    </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class CustomerOrder extends Vue {
    private firstName = "";
    private lastName = "";
    private address = "";
    private postNo = 0;
    private postPlace = "";
    private noOfMeals = 1;
    private deliveryDay = "";
    private deliveryType = "";
    private boxType = "";
    private allergies = [
        {
            name: "Gluten",
            selected: false
        },
        {
            name: "Skalldyr",
            selected: false
        },
        {
            name: "Egg",
            selected: false
        },
        {
            name: "Fisk",
            selected: false
        },
        {
            name: "Peanøtter",
            selected: false
        },
        {
            name: "Nøtter",
            selected: false
        },
        {
            name: "Melk",
            selected: false
        },
        {
            name: "Soya",
            selected: false
        },
        {
            name: "Selleri",
            selected: false
        },
        {
            name: "Sennep",
            selected: false
        },
        {
            name: "Sesam",
            selected: false
        },
        {
            name: "Svovel",
            selected: false
        },
        {
            name: "Lupin",
            selected: false
        },
        {
            name: "Bløtdyr",
            selected: false
        } 
    ];
    private add = "";

    // Rules:
    numbers(value: string) {
        return !isNaN(parseInt(value)) || "Vennligst oppgi et gyldig postnummer";
    }
    length(value: string) {
        return value.length == 4 || "Vennligst oppgi et gyldig postnummer";
    }
    
    sendToDb() {

    }
}
</script>
