<template>
	<v-row class="fill-height">
		<v-col>
			<v-sheet height="64">
				<v-spacer></v-spacer>
				<v-toolbar flat>
					<v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
						I dag
					</v-btn>
					<v-btn fab text stmall color="grey darken-2" @click="prev">
						<v-icon small>mdi-chevron-left</v-icon>
					</v-btn>
					<v-btn fab text stmall color="grey darken-2" @click="next">
						<v-icon small>mdi-chevron-right</v-icon>
					</v-btn>
					<v-toolbar-title v-if="$refs.calendar">
						{{ $refs.calendar.title }}
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

	private computed: object = {
		title(): string {
			const { start, end } = this;
			if (!start || !end) {
				return '';
			}
		},
	};
	mounted() {
		this.focus = '';
	}
	viewDay({ date }) {
		this.focus = date;
		this.type = 'day';
	}
	setToday() {
		this.focus = '';
	}
	prev() {
		(this.$refs.calendar as any).prev();
	}
	next() {
		(this.$refs.calendar as any).next();
	}
	updateRange({ start, end }) {
		this.start = start;
		this.end = end;
	}
}
</script>
