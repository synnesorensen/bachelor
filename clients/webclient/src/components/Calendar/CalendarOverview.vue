<template>
	<v-row class="fill-height">
		<v-col>
			<v-sheet height="64">
				<v-spacer></v-spacer>
				<v-toolbar outlined class="mr-4" flat>
					<v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
						Today
					</v-btn>
					<v-btn fab text stmall color="grey darken-2" @click="prev">
						<v-icon small>mdi-chevron-left</v-icon>
					</v-btn>
					<v-btn fab text stmall color="grey darken-2" @click="next">
						<v-icon small>mdi-chevron-right</v-icon>
					</v-btn>
					<v-toolbar-title>
						{{ title }}
					</v-toolbar-title>
				</v-toolbar>
			</v-sheet>
			<v-spacer></v-spacer>
			<v-sheet height="600">
				<v-calendar
					ref="calendar"
					v-model="focus"
					locale="no"
					color="primary"
					weekdays="1, 2, 3, 4, 5"
					:now="today"
					@change="updateRange"
				>
				</v-calendar>
			</v-sheet>
		</v-col>
	</v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class CalendarOverview extends Vue {
	private today = new Date().toISOString().substr(0, 10);
	private focus = new Date().toISOString().substr(0, 10);
	private type = 'month';
	private name: null;
	private details: null;
	private start: null;
	private end: null;
	private color: '#1976D2';
	private currentlyEditing: null;
	private selectedEvent: {};
	private selectedElement: null;
	private selectedOpen: false;
	private events: [];
	private dialog: false;

	private computed: object = {
		title() {
			const { start, end } = this;
			if (!start || !end) {
				return '';
			}
			// 	const startMonth = this.monthFormatter(start);
			// 	const endMonth = this.monthFormatter(end);
			// 	const suffixMonth = startMonth === endMonth ? '' : endMonth;
			// 	const startYear = start.year;
			// 	const endYear = end.year;
			// 	const suffixYear = startYear === endYear ? '' : endYear;
			// 	const startDay = start.day + this.nth(start.day);
			// 	const endDay = end.day + this.nth(end.day);
			// },
			// monthFormatter() {
			// 	return this.$refs.calendar.getFormatter({
			// 		timeZone: 'UTC',
			// 		month: 'long',
			// 	});
		},
	};
	viewDay({ date }) {
		this.focus = date;
		this.type = 'day';
	}
	setToday() {
		this.focus = '';
	}
	prev() {
		this.$refs.calendar.prev();
	}
	next() {
		this.$refs.calendar.next();
	}
	updateRange({ start, end }) {
		this.start = start;
		this.end = end;
	}
	nth(d: number) {
		return d > 3 && d < 21
			? 'th'
			: ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
	}
}
</script>
