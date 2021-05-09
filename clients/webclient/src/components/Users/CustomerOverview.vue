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
                    :events="events"
					:now="today"
                    show-week
                    @click:event="showEvent"
                    @change="getEvents"
				>
				</v-calendar>
			</v-sheet>
		</v-col>
	</v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import  api from "../../api/api";

@Component
export default class CustomerOverview extends Vue {
	private today = new Date().toISOString().substr(0, 10);
	private focus = new Date().toISOString().substr(0, 10);
	private type = "month";
	private start = null;
	private end = null;
    private events: any[] =[];
    private selectedEvent = "";

	mounted() {
		this.focus = "";
	}
	viewDay(day: any) {
		this.focus = day.date;
		this.type = "day";
	}
	setToday() {
		this.focus = "";
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

    async getEvents( {start, end}:{start:any, end:any} ) {
        let events: any[] = [];
        let deliveries = await api.getAllUsersDeliveries(start.date, end.date);
        let sub = await api.getUserSubscriptions();
        let schedule = sub[0].schedule;

        if (deliveries) {
            deliveries.forEach((del) => {
                const delStart = new Date(`${del.deliverytime.substring(0,10)}T00:00:00`);
                const delEnd = new Date(`${del.deliverytime.substring(0,10)}T23:59:59`);
                const menu = schedule.find(({id}) => id == del.menuId);

                events.push({
                    name: menu!.menu,
                    start: delStart,
                    end: delEnd,
                    color: "green"
                });
            });
            this.events = events;
        }
    }
    showEvent(nativeEvent:any, event:any) {
        this.selectedEvent = event;
        
    }
}
</script>
