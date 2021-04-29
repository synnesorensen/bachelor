<template>
	<v-row class="fill-height">
		<v-col>
			<v-sheet height="64">
				<v-spacer />
				<v-toolbar flat>
					<v-btn outlined @click="setToday"> I dag </v-btn>
					<v-btn fab text small @click="prev">
						<v-icon small>mdi-chevron-left</v-icon>
					</v-btn>
					<v-btn fab text small @click="next">
						<v-icon small>mdi-chevron-right</v-icon>
					</v-btn>
					<v-toolbar-title v-if="$refs.calendar">
						{{ $refs.calendar.title }}
					</v-toolbar-title>
				</v-toolbar>
			</v-sheet>
            <v-spacer />
			<v-sheet height="600">
				<v-calendar
					ref="calendar"
					v-model="focus"
					locale="no"
					color="primary"
					weekdays="1, 2, 3, 4, 5"
                    show-week
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

@Component({
	components: {
		
	},
})
export default class AdminOverview extends Vue {
    private today = new Date().toISOString().substr(0, 10);
	private focus = new Date().toISOString().substr(0, 10);
	private type = 'month';
	private start = null;
	private end = null;

    mounted() {
		this.focus = '';
	}
	viewDay(day: any) {
		this.focus = day.date;
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
	updateRange(range: any) {
		this.start = range.start;
		this.end = range.end;
	}
}
</script>
