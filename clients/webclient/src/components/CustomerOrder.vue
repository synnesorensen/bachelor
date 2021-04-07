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
            	<v-col cols="4">
                	<v-text-field label="Postnummer" v-model="Postnummer"></v-text-field>
            	</v-col>
            	<v-col>
                	<v-text-field label="Poststed" v-model="Poststed"></v-text-field>
            	</v-col>
        	</v-row>
        	<v-row>
            	<h4>Antall porsjoner</h4>
        	</v-row>
        	<v-row>
            	<v-chip-group v-model="days" active-class="blue--text text--accent-4" mandatory>
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
            	<v-chip-group v-model="days" active-class="blue--text text--accent-4" multiple>
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
            	<v-chip-group v-model="days" active-class="blue--text text--accent-4" mandatory>
                	<v-chip filter outlined>
                    	Enkel levering (kr. 149)
                	</v-chip>
                	<v-chip filter outlined>
                    	Fire uker (kr. 137 per levering)
                	</v-chip>
                	<v-chip filter outlined>
                    	Åtte uker (kr. 137 per levering)
                	</v-chip>
            	</v-chip-group>
        	</v-row>
        	<v-row>
            	<h4>Hvilken type bokser ønsker du?</h4>
        	</v-row>
        	<v-row>
            	<v-chip-group v-model="days" active-class="blue--text text--accent-4" mandatory>
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
            	<v-chip-group v-model="days" active-class="blue--text text--accent-4" multiple>
                	<v-chip filter outlined>
                    	Nøtter
                	</v-chip>
                	<v-chip filter outlined>
                    	Sjømat
                	</v-chip>
                	<v-chip filter outlined>
                    	Gluten
                	</v-chip>
                	<v-chip filter outlined>
                    	Laktose
                	</v-chip>
                	<v-chip filter outlined>
                    	Melkeprotein
                	</v-chip>
                	<v-chip filter outlined>
                    	Hvete
                	</v-chip>
                	<v-chip filter outlined>
                    	Løk
                	</v-chip>
                	<v-chip filter outlined>
                    	Tomat
                	</v-chip>
            	</v-chip-group>
        	</v-row>
        	<v-row>
            	<v-text-field label="Annen informasjon du vil legge til?" v-model="Annet"></v-text-field>
        	</v-row>
        	<v-row>
            	<v-btn>Send</v-btn>
        	</v-row>
		</v-container>
    </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class CustomerOrder extends Vue {
    
}
</script>
