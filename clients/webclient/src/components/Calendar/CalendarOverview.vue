<template>
	<v-sheet height="600" width="70%">
		<h2>Her skal det være tekst</h2>
		<v-calendar locale="no" color="primary" weekdays="1, 2, 3, 4, 5"> </v-calendar>
	</v-sheet>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class CalendarOverview extends Vue {
	// data: () => {
	// 	type: 'month';
	// 	start: '2019-01-01';
	// 	end: '2021-12-01';
	// 	typeOptions: [{ text: 'Dag'; value: 'day' }];
	// 	shortWeekdays: false;
	// 	weekdays: [1, 2, 3, 4, 5];
	// };
}
</script>
